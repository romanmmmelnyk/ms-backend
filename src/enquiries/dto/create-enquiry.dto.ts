import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateEnquiryDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsNotEmpty({ message: 'Please select a project type' })
  @IsIn(['web-development', 'mobile-app', 'ui-ux-design', 'consulting', 'other'], {
    message: 'Invalid project type',
  })
  projectType: string;

  @IsOptional()
  @IsIn(
    ['under-10k', '10k-25k', '25k-50k', '50k-100k', 'over-100k'],
    { message: 'Invalid budget range' },
  )
  budget?: string;

  @IsOptional()
  @IsIn(
    ['asap', '1-3-months', '3-6-months', '6-12-months', 'flexible'],
    { message: 'Invalid timeline' },
  )
  timeline?: string;

  @IsNotEmpty({ message: 'Project description is required' })
  @IsString()
  @MinLength(20, { message: 'Project description must be at least 20 characters' })
  message: string;

  @IsOptional()
  @IsBoolean()
  newsletter?: boolean;
}

