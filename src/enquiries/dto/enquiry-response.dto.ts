export class EnquiryResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  newsletter: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<EnquiryResponseDto>) {
    Object.assign(this, partial);
  }
}

