'use client';

import { Button } from '../components/ui/button';
import type { LoginActionsProps } from './login.types';

export function LoginActions(props: LoginActionsProps) {
  if (props.variant === 'account-selection') {
    return (
      <>
        <Button
          onClick={() => props.onSelectAccountType('personal')}
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          Personal Account
        </Button>
        <Button
          onClick={() => props.onSelectAccountType('business')}
          className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          size="lg"
        >
          Business Account
        </Button>
        <div className="text-center pt-4">
          <button
            onClick={props.onNavigateToSignup}
            className="text-sm text-purple-600 hover:underline"
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={props.onBackToAccountType}
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to account type
      </button>
    </div>
  );
}
