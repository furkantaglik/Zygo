import React, { ReactNode } from "react";
import withAuth from "../auth/withAuth";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default withAuth(ProtectedLayout);
