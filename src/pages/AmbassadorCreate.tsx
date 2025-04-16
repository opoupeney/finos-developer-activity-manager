
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AmbassadorForm from '@/components/Ambassador/AmbassadorForm';
import { createAmbassador } from '@/services/ambassadorService';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';

const AmbassadorCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAmbassador = async (formData: any) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      console.log('Submitting ambassador data:', formData);
      
      // Fix for the missing headshot_url and other nullable fields
      const ambassadorData = {
        ...formData,
        headshot_url: formData.headshot_url || null,
        location: formData.location || null,
        linkedin_profile: formData.linkedin_profile || null,
        github_id: formData.github_id || null,
        company: formData.company || null,
        title: formData.title || null,
        bio: formData.bio || null
      };
      
      const newAmbassador = await createAmbassador(ambassadorData);
      console.log('Ambassador created successfully:', newAmbassador);
      
      toast({
        title: 'Success',
        description: 'Ambassador created successfully',
      });
      
      // Navigate to the ambassador view page
      navigate(`/ambassadors/${newAmbassador.id}`);
    } catch (error: any) {
      console.error('Error creating ambassador:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ambassador',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create Ambassador
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new FINOS ambassador to the program
          </p>
        </div>
        
        <AmbassadorForm 
          onSubmit={handleCreateAmbassador} 
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
};

export default AmbassadorCreate;
