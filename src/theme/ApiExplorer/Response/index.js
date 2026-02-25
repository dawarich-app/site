import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { usePrismTheme } from "@docusaurus/theme-common";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ApiCodeBlock from "@theme/ApiExplorer/ApiCodeBlock";
import { useTypedSelector, useTypedDispatch } from "@theme/ApiItem/hooks";
import SchemaTabs from "@theme/SchemaTabs";
import TabItem from "@theme/TabItem";
import { OPENAPI_RESPONSE } from "@theme/translationIds";
import clsx from "clsx";
import { clearResponse, clearCode, clearHeaders } from "./slice";

function formatXml(xml) {
  const tab = "  ";
  let formatted = "";
  let indent = "";
  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    formatted += indent + "<" + node + ">\r\n";
    if (node.match(/^<?\w[^>]*[^/]$/)) {
      indent += tab;
    }
  });
  return formatted.substring(1, formatted.length - 3);
}

const FETCHING_MESSAGE = "Fetching...";

function Response({ item }) {
  const metadata = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const themeConfig = siteConfig.themeConfig;
  const hideSendButton = metadata.frontMatter.hide_send_button;
  const proxy = metadata.frontMatter.proxy ?? themeConfig.api?.proxy;
  const prismTheme = usePrismTheme();
  const code = useTypedSelector((state) => state.response.code);
  const headers = useTypedSelector((state) => state.response.headers);
  const response = useTypedSelector((state) => state.response.value);
  const dispatch = useTypedDispatch();

  const responseStatusClass =
    code &&
    "openapi-response__dot " +
      (parseInt(code) >= 400
        ? "openapi-response__dot--danger"
        : parseInt(code) >= 200 && parseInt(code) < 300
          ? "openapi-response__dot--success"
          : "openapi-response__dot--info");

  if ((!item.servers && !proxy) || hideSendButton) {
    return null;
  }

  let prettyResponse = response;
  if (prettyResponse) {
    try {
      prettyResponse = JSON.stringify(JSON.parse(response), null, 2);
    } catch {
      if (response.startsWith("<")) {
        prettyResponse = formatXml(response);
      }
    }
  }

  const isFetching = prettyResponse === FETCHING_MESSAGE;
  const hasResponse = code && prettyResponse && !isFetching;
  const hasError = !code && prettyResponse && !isFetching;
  const isIdle = !prettyResponse && !isFetching;

  const placeholderMessage = translate({
    id: OPENAPI_RESPONSE.PLACEHOLDER,
    message:
      'Click the <code>Send API Request</code> button above and see the response here!',
  });

  const handleClear = () => {
    dispatch(clearResponse());
    dispatch(clearCode());
    dispatch(clearHeaders());
  };

  const renderResponseContent = () => {
    if (hasResponse) {
      return (
        <SchemaTabs lazy>
          <TabItem
            label={` ${code}`}
            value="body"
            attributes={{
              className: clsx("openapi-response__dot", responseStatusClass),
            }}
            default
          >
            <ApiCodeBlock
              className="openapi-explorer__code-block openapi-response__status-code"
              language={response.startsWith("<") ? "xml" : "json"}
            >
              {prettyResponse}
            </ApiCodeBlock>
          </TabItem>
          <TabItem
            label={translate({
              id: OPENAPI_RESPONSE.HEADERS_TAB,
              message: "Headers",
            })}
            value="headers"
          >
            <ApiCodeBlock
              className="openapi-explorer__code-block openapi-response__status-headers"
              language={response.startsWith("<") ? "xml" : "json"}
            >
              {JSON.stringify(headers, undefined, 2)}
            </ApiCodeBlock>
          </TabItem>
        </SchemaTabs>
      );
    }

    if (isFetching) {
      return (
        <div className="openapi-explorer__loading-container">
          <div className="openapi-response__lds-ring">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      );
    }

    if (hasError) {
      return (
        <p className="openapi-explorer__response-placeholder-message openapi-explorer__response-error">
          {prettyResponse}
        </p>
      );
    }

    return (
      <p
        className="openapi-explorer__response-placeholder-message"
        dangerouslySetInnerHTML={{ __html: placeholderMessage }}
      />
    );
  };

  const showBackground = hasResponse;

  return (
    <div className="openapi-explorer__response-container">
      <div className="openapi-explorer__response-title-container">
        <span className="openapi-explorer__response-title">
          {translate({
            id: OPENAPI_RESPONSE.TITLE,
            message: "Response",
          })}
        </span>
        <span
          className="openapi-explorer__response-clear-btn"
          onClick={handleClear}
        >
          {translate({
            id: OPENAPI_RESPONSE.CLEAR,
            message: "Clear",
          })}
        </span>
      </div>
      <div
        style={{
          backgroundColor: showBackground
            ? prismTheme.plain.backgroundColor
            : "transparent",
          paddingLeft: "1rem",
          paddingTop: "1rem",
          ...(!showBackground && { paddingBottom: "1rem" }),
        }}
      >
        {renderResponseContent()}
      </div>
    </div>
  );
}

export default Response;
