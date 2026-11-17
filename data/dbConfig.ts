/**
 * POP-CON 외부 MySQL 직접 접속 설정 (Docker 미사용)
 * - Next.js Static Export(GitHub Pages) 환경에서는 목업 데이터를 사용하며,
 *   서버/API 연동 모드 실행 시 .env.local의 환경변수를 통해 직접 접속합니다.
 */
export interface MysqlConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  useDocker: boolean;
}

export const mysqlConfig: MysqlConnectionConfig = {
  host: process.env.DB_HOST || 'cdn.ditanet.duckdns.org',
  port: Number(process.env.DB_PORT || 8306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'popcon',
  useDocker: false,
};

export function getMysqlUrl(): string {
  const { host, port, user, password, database } = mysqlConfig;
  const auth = password ? `${user}:${encodeURIComponent(password)}` : user;
  return `mysql://${auth}@${host}:${port}/${database}`;
}
