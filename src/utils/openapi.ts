import { flatten } from 'lodash-es';

/**
 * 请求openapi，拿到结果之后解析openapi
 * @returns
 */
export async function parseOpenapi() {
  return fetch(
    'https://td-dev-public.oss-cn-hangzhou.aliyuncs.com/maoyes-app/1705990860186928597.json',
  )
    .then((res) => res.json())
    .then((res) => {
      const { info, paths, components } = res as OpenAPI;

      const root: { key: React.Key; title: string; children?: any[] } = {
        key: 'root',
        title: info.title,
        children: [],
      };

      // 从paths里面过滤掉method为delete或者options的请求
      Object.entries(paths).forEach(([key, value]) => {
        const method = Object.keys(value)[0];
        if (['delete', 'options'].includes(method)) {
          delete paths[key];
        }
      });

      // 解析paths，将所有paths里面tags相同的归类到一起
      const pathsKeys = Object.keys(paths);
      const pathsValues = Object.values(paths);

      const pathsMap = pathsKeys.reduce((acc, cur, index) => {
        const body = pathsValues[index];
        const content = Object.values(body)[0];

        const method = Object.keys(body)[0];
        const tag = content.tags[0];

        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push({
          path: cur,
          method,
          parameters: content.parameters,
          result: parseSchema(
            Object.values(content.responses['200'].content)[0].schema,
            components.schemas,
          ),
          title: content.summary,
          requestName: content.operationId,
        });
        return acc;
      }, {} as Record<string, OpenAPIPathMapValue[]>);

      const pathsMapValues = Object.values(pathsMap);

      Object.entries(pathsMap).forEach(([key, value]) => {
        root.children!.push({
          title: key,
          key: key,
          children: value.map((item) => ({
            key: item.path,
            icon: item.method,
            title: `${item.title}(${item.path})`,
          })),
        });
      });

      return {
        root,
        paths: flatten(pathsMapValues),
      };
    });
}

/**
 * 解析schema
 * @param schema
 * @param components
 * @returns
 */
function parseSchema(
  schema: OpenAPISchema,
  components: Record<string, OpenAPIComponent>,
): OpenAPIResult[] {
  const result: OpenAPIResult[] = [];

  const { $ref } = schema;
  if ($ref) {
    const name = $ref.split('/').pop();
    const component = components[name!];
    if (!component) {
      return result;
    }
    const { properties } = component;
    const propertiesKeys = Object.keys(properties);
    const propertiesValues = Object.values(properties);

    propertiesKeys.forEach((key, index) => {
      const value = propertiesValues[index];
      const obj: OpenAPIResult = {
        name: key,
        type: value.type!,
        label: value.description || '',
        required: !!component.required?.includes(key),
      };
      if (value.type === 'array') {
        if (value.items?.$ref) {
          const items = parseSchema(value.items, components);
          Object.assign(obj, { items });
        } else if (value.items) {
          Object.assign(obj, { itemType: value.items.type, items: [] });
        }
      }
      if (value.$ref) {
        const items = parseSchema(value, components);
        Object.assign(obj, { items, type: 'array' });
      }
      result.push(obj);
    });
  }

  return result;
}
