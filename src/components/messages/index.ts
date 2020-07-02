import { createContext } from "react";

export type Status = "success" | "error" | "info" | "warning";
export interface IMessage {
  actionBtn?: {
    label: string;
    action: () => void;
  };
  autohide?: number;
  expandText?: string;
  title?: string;
  text: string;
  onUndo?: () => void;
  status?: Status;
}

export interface IOptions {
  timeout: number;
  type?: Status;
}

export interface INotification {
  id: string;
  message: IMessage;
  options: IOptions;
  close: () => void;
}

export interface ITimer {
  id: string;
  notification: INotification;
  remaining: number;
  start: number;
  timeoutId: number;
}

export const types = {
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning"
};
export interface INotificationContext {
  show: (message: IMessage, options?: IOptions) => void;
  remove: (notification: INotification) => void;
}

export type IMessageContext = (message: IMessage) => void;
export const MessageContext = createContext<
  React.MutableRefObject<INotificationContext>
>(null);

export * from "./MessageManager";
export * from "./MessageManagerProvider";
export { default } from "./MessageManagerProvider";
