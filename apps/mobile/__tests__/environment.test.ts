import { resolveMobileEnvironment } from '../src/config/environment';

describe('resolveMobileEnvironment', () => {
  it('normaliza a URL local da API', () => {
    expect(resolveMobileEnvironment('http://10.0.2.2:3001/api/v1/')).toEqual({
      apiBaseUrl: 'http://10.0.2.2:3001/api/v1',
      isLocalApi: true,
    });
  });

  it('aceita HTTPS fora do ambiente local', () => {
    expect(resolveMobileEnvironment('https://api.onlyfrangos.com/api/v1')).toEqual({
      apiBaseUrl: 'https://api.onlyfrangos.com/api/v1',
      isLocalApi: false,
    });
  });

  it('aceita HTTP para um dispositivo na rede local', () => {
    expect(resolveMobileEnvironment('http://192.168.1.20:3001/api/v1')).toEqual({
      apiBaseUrl: 'http://192.168.1.20:3001/api/v1',
      isLocalApi: true,
    });
  });

  it('rejeita HTTP fora do ambiente local', () => {
    expect(() => resolveMobileEnvironment('http://api.onlyfrangos.com/api/v1')).toThrow(
      'precisa usar HTTPS',
    );
  });

  it('rejeita uma URL inválida', () => {
    expect(() => resolveMobileEnvironment('endereco-invalido')).toThrow(
      'precisa ser uma URL válida',
    );
  });
});
