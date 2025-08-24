export interface IAdsPowerUserProxyConfig {
  proxy_soft: string;
  proxy_type: string;
  proxy_host: string;
  proxy_port: string;
  proxy_user: string;
  proxy_password: string;
  proxy_url: string;
}

export interface IAdsPowerProfile {
  name: string;
  domain_name: string;
  created_time: string;
  ip: string;
  ip_country: string;
  password: string;
  fbcc_proxy_acc_id: string;
  ipchecker: string;
  fakey: string;
  sys_app_cate_id: string;
  user_proxy_config: IAdsPowerUserProxyConfig;
  group_id: string;
  group_name: string;
  remark: string;
  serial_number: string;
  last_open_time: string;
  user_id: string;
  username: string;
}
