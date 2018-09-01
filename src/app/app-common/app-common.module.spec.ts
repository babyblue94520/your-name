import { AppCommonModule } from './app-common.module';

describe('AppCommonModule', () => {
  let appCommonModule: AppCommonModule;

  beforeEach(() => {
    appCommonModule = new AppCommonModule();
  });

  it('should create an instance', () => {
    expect(appCommonModule).toBeTruthy();
  });
});
