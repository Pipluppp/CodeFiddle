import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  Row,
  Col,
  Button,
  Card,
  Space,
  Typography,
  Tag,
  Spin,
  message,
  Tooltip,
} from "antd";

import { buildApiUrl } from "../src/utils/api";
import { PlaygroundTemplate } from "../Types/types";

import "../assets/landing.css";

import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
} from "react-icons/si";

const TEMPLATE_ICONS: Record<string, ReactNode> = {
  react: <SiReact className="template-card__logo" />,
  vue: <SiVuedotjs className="template-card__logo" />,
  angular: <SiAngular className="template-card__logo" />,
  svelte: <SiSvelte className="template-card__logo" />,
  javascript: <SiJavascript className="template-card__logo" />,
  typescript: <SiTypescript className="template-card__logo" />,
  node: <SiNodedotjs className="template-card__logo" />,
  express: <SiExpress className="template-card__logo" />,
};

const { Title, Paragraph, Text } = Typography;

export const LandingPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PlaygroundTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(buildApiUrl("/templates"))
      .then((resp) => {
        const fetchedTemplates: PlaygroundTemplate[] = resp.data?.templates || [];
        setTemplates(fetchedTemplates);
        setSelectedTemplateId((current) => {
          if (current) {
            return current;
          }
          return fetchedTemplates.length ? fetchedTemplates[0].id : null;
        });
        setLoadError(null);
      })
      .catch((error) => {
        console.error(error);
        setLoadError("Failed to load templates");
        message.error("Could not load templates. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId) {
      return null;
    }
    return templates.find((template) => template.id === selectedTemplateId) || null;
  }, [selectedTemplateId, templates]);

  const handleCreatePlayground = (templateId: string) => {
    if (!templateId) {
      return;
    }

    setIsCreating(true);
    axios
      .post(buildApiUrl("/playgrounds"), { template: templateId })
      .then((resp) => {
        navigate(`/playground/${resp.data.playgroundId}`);
      })
      .catch((error) => {
        console.error(error);
        message.error("Could not create playground. Check the console for details.");
      })
      .finally(() => setIsCreating(false));
  };

  const renderTemplates = () => {
    if (isLoading) {
      return (
        <div className="landing-loading">
          <Spin size="large" />
          <Text type="secondary">Fetching templates...</Text>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="landing-error">
          <Text type="danger">{loadError}</Text>
        </div>
      );
    }

    return (
      <div className="template-grid">
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId;
          const icon = TEMPLATE_ICONS[template.id] ?? (
            <SiJavascript className="template-card__logo" />
          );
          return (
            <Tooltip
              key={template.id}
              title={`Launch ${template.title} playground`}
              placement="top"
            >
              <Card
                hoverable
                className={`template-card${isSelected ? " template-card--selected" : ""}`}
                onClick={() => handleCreatePlayground(template.id)}
              >
                <Space direction="vertical" size="middle">
                  <div className="template-card__header">
                    <div className="template-card__titleGroup">
                      {icon}
                      <Title level={3} className="template-card__title">
                        {template.title}
                      </Title>
                    </div>
                    <Tag
                      color={template.hasPreview ? "blue" : "purple"}
                      className="template-card__modeTag"
                    >
                      {template.hasPreview ? "Preview" : "Console"}
                    </Tag>
                  </div>
                  <Paragraph className="template-card__description">
                    {template.description}
                  </Paragraph>
                  {template.tags.length ? (
                    <div className="template-card__tags">
                      {template.tags.map((tag) => (
                        <Tag key={`${template.id}-${tag}`} className="template-card__tag">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  ) : null}
                </Space>
              </Card>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  return (
    <Row className="landing-container" justify="center">
      <Col xxl={20} xl={20} lg={22} md={22} sm={22} xs={24}>
        <div className="landing-header">
          <Title level={2} className="landing-title">
            Choose a starting template
          </Title>
          <Paragraph className="landing-subtitle">
            We scaffold the project, install dependencies, and start the dev server for you.
          </Paragraph>
        </div>
        {renderTemplates()}

      </Col>
    </Row>
  );
};
