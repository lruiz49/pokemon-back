import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';

function prismaErr(code: string, meta?: Record<string, any>) {
  const e = new Prisma.PrismaClientKnownRequestError('x', { code, clientVersion: 'test' } as any);
  (e as any).code = code;
  (e as any).meta = meta;
  return e;
}

function makeHost() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const response = { status };
  const request = { url: '/pokemon' };
  const switchToHttp = () => ({ getResponse: () => response, getRequest: () => request });
  return { switchToHttp } as unknown as ArgumentsHost & { _res: any; _json: any };
}

describe('PrismaClientExceptionFilter', () => {
  const filter = new PrismaClientExceptionFilter();

  it('maps P2002 to 409', () => {
    const host = makeHost();
    filter.catch(prismaErr('P2002', { target: ['name'] }), host);
    expect((host as any).switchToHttp().getResponse().status).toHaveBeenCalledWith(409);
  });

  it('maps P2003 to 400', () => {
    const host = makeHost();
    filter.catch(prismaErr('P2003', { field_name: 'abilityId' }), host);
    expect((host as any).switchToHttp().getResponse().status).toHaveBeenCalledWith(400);
  });

  it('falls back to 500 for other codes', () => {
    const host = makeHost();
    filter.catch(prismaErr('P9999'), host);
    expect((host as any).switchToHttp().getResponse().status).toHaveBeenCalledWith(500);
  });
});