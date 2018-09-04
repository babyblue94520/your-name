import { CompanyModule } from './company.module';

describe('CompanyModule', () => {
  let companyModule: CompanyModule;

  beforeEach(() => {
    companyModule = new CompanyModule();
  });

  it('should create an instance', () => {
    expect(companyModule).toBeTruthy();
  });
});
