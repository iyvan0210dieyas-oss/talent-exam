"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User, Shield } from 'lucide-react';

type WelcomePageProps = {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
};

export default function WelcomePage({ onStudentLogin, onAdminLogin }: WelcomePageProps) {
  const welcomeImage = PlaceHolderImages.find(img => img.id === 'welcome-image');

  return (
    <Card className="w-full max-w-2xl text-center shadow-2xl animate-slide-in-up">
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl font-extrabold font-headline text-primary">
          Welcome to Talent Tango Puzzle Master
        </CardTitle>
        <CardDescription className="text-lg md:text-xl text-muted-foreground pt-2">
          Test Your Mental Ability & Problem-Solving Skills
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        {welcomeImage && (
          <Image
            src={welcomeImage.imageUrl}
            alt={welcomeImage.description}
            width={500}
            height={300}
            className="rounded-lg object-contain shadow-lg"
            data-ai-hint={welcomeImage.imageHint}
            priority
          />
        )}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
           <Button size="lg" className="flex-1 text-lg" onClick={onStudentLogin}>
            <User className="mr-2" /> Student Login
          </Button>
          <Button size="lg" variant="outline" className="flex-1 text-lg" onClick={onAdminLogin}>
            <Shield className="mr-2" /> Admin Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
