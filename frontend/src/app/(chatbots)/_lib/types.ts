export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}


/**
 * AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.
 */
export interface Message {
  id: string;
  createdAt?: Date;

  content: string;

  // @deprecated
  tool_call_id?: string;

  /**
@deprecated Use AI SDK RSC instead: https://sdk.vercel.ai/docs/ai-sdk-rsc
 */
  ui?: string | JSX.Element | JSX.Element[] | null | undefined;

  /**
   * `function` and `tool` roles are deprecated.
   */
  role:
    | 'system'
    | 'user'
    | 'assistant'
    | 'function' // @deprecated
    | 'data'
    | 'tool'; // @deprecated

  /**
   *
   * If the message has a role of `function`, the `name` field is the name of the function.
   * Otherwise, the name field should not be set.
   */
  name?: string;

  /**
   * @deprecated Use AI SDK 3.1 `toolInvocations` instead.
   *
   * If the assistant role makes a function call, the `function_call` field
   * contains the function call name and arguments. Otherwise, the field should
   * not be set. (Deprecated and replaced by tool_calls.)
   */
  function_call?: string | FunctionCall;

  data?: JSONValue;

  /**
   * @deprecated Use AI SDK 3.1 `toolInvocations` instead.
   *
   * If the assistant role makes a tool call, the `tool_calls` field contains
   * the tool call name and arguments. Otherwise, the field should not be set.
   */
  tool_calls?: string | ToolCall[];

  /**
   * Additional message-specific information added on the server via StreamData
   */
  annotations?: JSONValue[] | undefined;

  /**
Tool invocations (that can be tool calls or tool results, depending on whether or not the invocation has finished)
that the assistant made as part of this message.
   */
  toolInvocations?: Array<ToolInvocation>;
}
