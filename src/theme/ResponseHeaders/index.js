import React from "react";
import SchemaItem from "@theme/SchemaItem";
import {
  getSchemaName,
  getQualifierMessage,
} from "docusaurus-theme-openapi-docs/lib/markdown/schema";

export const ResponseHeaders = ({ responseHeaders }) => {
  if (!responseHeaders) {
    return null;
  }
  return (
    <ul style={{ marginLeft: "1rem" }}>
      {Object.entries(responseHeaders).map(([name, schema]) => (
        <SchemaItem
          key={name}
          name={name}
          collapsible={false}
          schemaName={getSchemaName(schema)}
          qualifierMessage={getQualifierMessage(schema)}
          schema={schema}
          discriminator={false}
          children={null}
        />
      ))}
    </ul>
  );
};

export default ResponseHeaders;
