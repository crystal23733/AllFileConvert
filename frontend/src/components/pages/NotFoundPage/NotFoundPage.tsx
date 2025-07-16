"use client";

import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/Typography/Typography";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import NotFoundPageProps from "./NotFoundPage.types";

const NotFoundPage: FC<NotFoundPageProps> = ({ onGoHome }) => {
  const { t } = useTranslation();

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center">
      <Typography variant="title" className="mb-4">
        {t("errors.notFound.title")}
      </Typography>
      <Typography variant="body" className="mb-8 text-gray-500">
        {t("errors.notFound.description")}
      </Typography>
      <Button onClick={onGoHome} variant="primary">
        {t("errors.notFound.button")}
      </Button>
    </section>
  );
};

export default NotFoundPage;
