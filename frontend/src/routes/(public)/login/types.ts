type LoginErrors = {
  emailLogin?: string[];
  passwordLogin?: string[];
};

type CreateErrors = {
  nameCreate?: string[];
  lastNameCreate?: string[];
  emailCreate?: string[];
  passwordCreate?: string[];
};

export type FormResult =
  | {
      action: 'login';
      success: false;
      data: Record<string, string>;
      errors: LoginErrors;
    }
  | {
      action: 'create';
      success: false;
      data: Record<string, string>;
      errors: CreateErrors;
    }
  | undefined;
