export enum AuthState {
  idle,
  loading,
  signingIn,
  signingOut,
  updatingProfile,
}

export const authStateEnumToString = (
  authStateEnum: AuthState
): string | null => {
  let text: string | null = null;
  switch (authStateEnum) {
    case AuthState.loading:
      text = 'Loading...';
      break;
    case AuthState.signingIn:
      text = 'Signing In...';
      break;
    case AuthState.signingOut:
      text = 'Signing Out...';
      break;
    case AuthState.updatingProfile:
      text = 'Updating Profile...';
      break;
    default:
      text = null;
  }
  return text;
};
