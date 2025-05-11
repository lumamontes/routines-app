import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date) => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatTime = (date: Date) => {
  return format(date, 'HH:mm', { locale: ptBR });
};