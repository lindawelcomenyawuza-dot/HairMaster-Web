import type { FormEventHandler, ReactNode } from 'react';
import type { AccountType } from '../../context/AppContext';

export type LoginAccountType = AccountType | null;

export interface LoginHeaderProps {
  title: string;
  description: ReactNode;
}

export interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  footer?: ReactNode;
}

export interface AccountSelectionActionsProps {
  variant: 'account-selection';
  onSelectAccountType: (accountType: AccountType) => void;
  onNavigateToSignup: () => void;
}

export interface FormActionsProps {
  variant: 'form';
  onBackToAccountType: () => void;
}

export type LoginActionsProps = AccountSelectionActionsProps | FormActionsProps;
