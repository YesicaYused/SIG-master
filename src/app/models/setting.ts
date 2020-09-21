export interface setting {
  id?: number;
  code: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface service {
  id?: number;
  description: string;
  title: string;
  image: string;
  state: string;
  created_at?: string;
  updated_at?: string;
}

export interface social_network {
  id?: number;
  name: string;
  route: string;
  icon: string;
  state: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface menu_footer {
  id?: number;
  name: string;
  route: string;
  state: string;
  copyRight?: string;
  created_at?: string;
  updated_at?: string;
}

export interface menu_header_one {
  id?: number;
  name: string;
  route: string;
  icon: string;
  state: string;
  type: string;
  authentication?: string;
  created_at?: string;
  updated_at?: string;
  number_menu?: number;
}

export interface menu_header_two {
  id?: number;
  name: string;
  route: string;
  icon: string;
  state: string;
  type: string;
  authentication: string;
  created_at?: string;
  updated_at?: string;
}

export interface email {
  user_mail: string;
  password_mail: string;
  SMTPSecure: string;
  host_email: string;
  port_email: string;
  email_controller: string;
}

export interface banner {
  banner_title: string;
  banner_description: string;
  description_button: string;
  main_title: string;
  main_description: string;
}
