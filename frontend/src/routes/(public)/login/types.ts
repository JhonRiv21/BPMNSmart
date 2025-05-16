export type LoginFormResult = {
  action: 'login';
  data?: {
    emailLogin?: string;
    passwordLogin?: string;
  };
  errors?: {
    emailLogin?: string[];
    passwordLogin?: string[];
  };
};

export type CreateFormResult = {
  action: 'create';
  data?: {
    nameCreate?: string;
    lastNameCreate?: string;
    emailCreate?: string;
    passwordCreate?: string;
  };
  errors?: {
    nameCreate?: string[];
    lastNameCreate?: string[];
    emailCreate?: string[];
    passwordCreate?: string[];
  };
};

export type FormResult = LoginFormResult | CreateFormResult;
