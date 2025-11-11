import { useEffect, useMemo, useState } from "react";
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
} from "antd";

import { buildApiUrl } from "../src/utils/api";
import { PlaygroundTemplate } from "../Types/types";

import "../assets/landing.css";

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

  const handleCreatePlayground = () => {
    if (!selectedTemplateId) {
      return;
    }

    setIsCreating(true);
    axios
      .post(buildApiUrl("/playgrounds"), { template: selectedTemplateId })
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
          return (
            <Card
              key={template.id}
              hoverable
              className={`template-card${isSelected ? " template-card--selected" : ""}`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <Space direction="vertical" size="middle">
                <div className="template-card__header">
                  <Title level={3}>{template.title}</Title>
                  <Tag color={template.hasPreview ? "blue" : "purple"}>
                    {template.hasPreview ? "Preview" : "Console"}
                  </Tag>
                </div>
                <Paragraph type="secondary">{template.description}</Paragraph>
                {template.tags.length ? (
                  <div className="template-card__tags">
                    {template.tags.map((tag) => (
                      <Tag key={`${template.id}-${tag}`}>{tag}</Tag>
                    ))}
                  </div>
                ) : null}
              </Space>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Row className="landing-container" justify="center">
      <Col xxl={20} xl={20} lg={22} md={22} sm={22} xs={24}>
        <div className="landing-header">
          <Title level={2}>Choose a starting template</Title>
          <Paragraph type="secondary">
            We scaffold the project, install dependencies, and start the dev server for you.
          </Paragraph>
        </div>
        {renderTemplates()}
        <div className="landing-actions">
          <Button
            type="primary"
            size="large"
            onClick={handleCreatePlayground}
            disabled={!selectedTemplate}
            loading={isCreating}
          >
            Launch playground
          </Button>
          {selectedTemplate ? (
            <Text type="secondary">
              Launching <strong>{selectedTemplate.title}</strong>{" "}
              {selectedTemplate.hasPreview ? "with live preview" : "in console mode"}.
            </Text>
          ) : null}
        </div>
      </Col>
    </Row>
  );
};
