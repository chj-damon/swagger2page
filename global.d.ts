interface OpenAPI {
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, OpenAPIPath>;
  components: {
    schemas: Record<string, OpenAPIComponent>;
  };
}

interface OpenAPIComponent {
  type: string;
  properties: Record<string, OpenAPISchema>;
  description?: string;
  required?: string[];
}

interface OpenAPISchema {
  type?: string;
  format?: string;
  items?: OpenAPISchema;
  $ref?: string;
  description?: string;
}

type OpenAPIPath = Record<'get' | 'put' | 'post' | 'delete', OpenAPIMethod>;

interface OpenAPIMethod {
  tags: string[]; // 根据tags进行分类，同一个tag下的归属在一起
  summary: string;
  operationId: string;
  parameters: OpenAPIParameter[];
  responses: Record<string, OpenAPIResponse>;
}

interface OpenAPIParameter {
  name: string;
  in: string;
  description: string;
  required: boolean;
  schema: OpenAPISchema;
}

interface OpenAPIResponse {
  description: string;
  content: Record<string, OpenAPIContent>;
}

interface OpenAPIContent {
  schema: OpenAPISchema;
}

interface OpenAPIResult {
  name: string;
  label: string;
  type: string;
  required: boolean;
  items?: OpenAPIResult[];
  itemType?: string;
}

interface OpenAPIPathMapValue {
  method: string;
  path: string;
  requestName: string;
  title: string;
  parameters: OpenAPIParameter[];
  result: OpenAPIResult[];
}
