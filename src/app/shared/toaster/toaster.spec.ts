import { ToasterService } from './toaster';

describe('Toaster', () => {
  it('should be created', () => {
    const service = new ToasterService()
    expect(service).toBeTruthy();
  });
});
