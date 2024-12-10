import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Text } from './Themed';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function Button({ children, variant = 'primary', style, ...props }: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const buttonStyle = [
    styles.button,
    variant === 'primary' 
      ? { backgroundColor: colors.tint }
      : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.tint },
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'secondary' && { color: colors.tint },
  ];

  return (
    <TouchableOpacity style={buttonStyle} {...props}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
