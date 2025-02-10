import { useItem, useList, useMutation } from './useData';
import { animalService, showService, evaluationService } from '@/services/entities';
import type { Animal, Show, Evaluation } from '@/lib/types/mock';

// Animal Hooks
export function useAnimal(id: string) {
  return useItem(() => animalService.getById(id));
}

export function useAnimals() {
  return useList(() => animalService.getAll());
}

export function useAnimalsByBreed(breed: string) {
  return useList(() => animalService.getByBreed(breed));
}

export function useAnimalWithEvaluations(id: string) {
  return useItem(() => animalService.getWithEvaluations(id));
}

export function useCreateAnimal() {
  return useMutation((data: Omit<Animal, 'id'>) => animalService.create(data));
}

export function useUpdateAnimal(id: string) {
  return useMutation((data: Partial<Animal>) => animalService.update(id, data));
}

export function useDeleteAnimal() {
  return useMutation((id: string) => animalService.delete(id));
}

// Show Hooks
export function useShow(id: string) {
  return useItem(() => showService.getById(id));
}

export function useShows() {
  return useList(() => showService.getAll());
}

export function useUpcomingShows() {
  return useList(() => showService.getUpcoming());
}

export function useCreateShow() {
  return useMutation((data: Omit<Show, 'id'>) => showService.create(data));
}

export function useUpdateShow(id: string) {
  return useMutation((data: Partial<Show>) => showService.update(id, data));
}

export function useDeleteShow() {
  return useMutation((id: string) => showService.delete(id));
}

export function useRegisterForShow(showId: string) {
  return useMutation((animalIds: string[]) => showService.register(showId, animalIds));
}

// Evaluation Hooks
export function useEvaluation(id: string) {
  return useItem(() => evaluationService.getById(id));
}

export function useEvaluations() {
  return useList(() => evaluationService.getAll());
}

export function useAnimalEvaluations(animalId: string) {
  return useList(() => evaluationService.getByAnimalId(animalId));
}

export function useLatestEvaluation(animalId: string) {
  return useItem(() => evaluationService.getLatest(animalId));
}

export function useCreateEvaluation() {
  return useMutation(async (data: Omit<Evaluation, 'id'>) => {
    const evaluation = await evaluationService.create(data);
    evaluation.overallScore = await evaluationService.calculateOverallScore(evaluation);
    return evaluation;
  });
}

export function useUpdateEvaluation(id: string) {
  return useMutation(async (data: Partial<Evaluation>) => {
    const evaluation = await evaluationService.update(id, data);
    evaluation.overallScore = await evaluationService.calculateOverallScore(evaluation);
    return evaluation;
  });
}

export function useDeleteEvaluation() {
  return useMutation((id: string) => evaluationService.delete(id));
}

// Example usage in components:
/*
function AnimalList() {
  const { data: animals, isLoading, error } = useAnimals();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {animals?.map(animal => (
        <li key={animal.id}>{animal.name}</li>
      ))}
    </ul>
  );
}

function CreateAnimalForm() {
  const { mutate: createAnimal, isLoading } = useCreateAnimal();
  
  const handleSubmit = async (data: Omit<Animal, 'id'>) => {
    try {
      await createAnimal(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields *//*}
    </form>
  );
}
*/