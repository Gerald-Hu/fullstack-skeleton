import { Injectable, OnModuleInit } from "@nestjs/common";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TaskService } from "@/task/task.service";
import { GoalsService } from "@/goals/goals.service";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChainValues } from "@langchain/core/utils/types";
import { use } from "passport";

@Injectable()
export class AgentService {
  private llm!: ChatOpenAI;
  private agentExecutor!: AgentExecutor;
  private tools: DynamicTool[] = [];

  constructor(
    private taskService: TaskService,
    private goalService: GoalsService
  ) {}

  async onModuleInit() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "LLM failed to initialize",
      });
    }
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      temperature: 0.8,
      modelName: "gpt-4o-mini",
    });

    await this.initializeAgent();
  }

  private async initializeAgent() {
    this.tools = [
      new DynamicTool({
        name: "add_task",
        description: `Use this tool to create a new task for a user. 
          If content is not provided, suggest a task that relates to the user's goals. 
          In that case, DO NOT repeat user's goal. 

          Be helpful and specific for the task suggested instead of generic answers. Use the same language as the user.
          
          example: for user's goal "I want to learn React", suggest a task "Learn what is hooks" instead of "Learn React concepts".

          If duration is not provided, give the task a reasonable and realistic time for the task use your best judgement. 
          Format should be "30min", "1hr", etc.
          `,
        func: async (input: string) => {
          try {
            const parsedInput = JSON.parse(input);
            // Validate the input structure
            if (
              !parsedInput.userId ||
              !parsedInput.content ||
              !parsedInput.duration
            ) {
              throw new Error(
                "Missing required fields: userId, content, or duration"
              );
            }
            const task = await this.taskService.createTask(parsedInput.userId, {
              content: parsedInput.content,
              duration: parsedInput.duration,
              goal: parsedInput.goal,
            });
            return `Successfully created task: ${JSON.stringify(task)}`;
          } catch (error) {
            console.error("Error creating task:", error);
            return `Failed to create task: ${error}`;
          }
        },
      }),
      new DynamicTool({
        name: "delete_task",
        description:
          "Use this tool to delete a specific task for a user. Input should be a JSON string containing userId and taskId",
        func: async (input: string) => {
          try {
            const parsedInput = JSON.parse(input);
            // Validate the input structure
            if (!parsedInput.userId || !parsedInput.taskId) {
              throw new Error("Missing required fields: userId or taskId");
            }

            await this.taskService.deleteTask(
              parsedInput.userId,
              parsedInput.taskId
            );
            return `Successfully deleted task ${parsedInput.taskId}`;
          } catch (error) {
            console.error("Error deleting task:", error);
            return `Failed to delete task: ${error}`;
          }
        },
      }),
    ];

    // Update the prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a task management agent that can add or delete tasks.
        
        Use add_task when you need to create a new task for a user.
        Use delete_task when you need to remove an existing task.

        When using add_task, format the input as a JSON string with:
        
          "userId": "user's id",
          "content": "task description",
          "duration": "time duration",
          "goal": "goal id"
        

        When using delete_task, format the input as a JSON string with:
        
          "userId": "user's id",
          "taskId": "task's id"

        If you are not able to extract some of the information, give a null to that field.
        `,
      ],
      [
        "human",
        `
        Input: {input}
        UserId: {user_id}

        Analyze the input and use the appropriate tool.
        `,
      ],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createOpenAIToolsAgent({
      llm: this.llm,
      tools: this.tools,
      prompt,
    });

    // Create the executor
    this.agentExecutor = new AgentExecutor({
      agent,
      tools: this.tools,
      verbose: false,
      maxIterations: 2,
    });
  }

  async create(userId: string, input: string) {
    try {
      const result: ChainValues = await this.agentExecutor.invoke({
        input,
        user_id: userId,
      });

      return JSON.stringify(result);
    } catch (error) {
      console.error("Error in agent execution:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to execute agent",
        cause: error,
      });
    }
  }
}
