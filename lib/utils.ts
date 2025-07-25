export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function createApiResponse(status: string, message: string, data?: any) {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse(message: string, data?: any) {
  return {
    status: "error",
    message,
    data,
    timestamp: new Date().toISOString()
  };
}