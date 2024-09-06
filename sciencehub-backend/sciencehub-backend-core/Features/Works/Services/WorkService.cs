using sciencehub_backend_core.Features.Works.DTOs;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Features.Works.Repositories;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Works.Services
{
    public class WorkService : IWorkService 
    {
        private readonly IWorkRepository _workRepository;

        public WorkService(IWorkRepository workRepository)
        {
            _workRepository = workRepository;
        }

        public async Task<Work> GetWorkAsync(int workId)
        {
            return await _workRepository.GetWorkAsync(workId);
        }

        public async Task<IEnumerable<WorkSearchDTO>> GetWorksByUserIdAsync(Guid userId)
        {
            var works = await _workRepository.GetWorksByUserIdAsync(userId);

            return works.Select(mapWorkToWorkSearchDTO);
        }

        public async Task<IEnumerable<WorkSearchDTO>> GetWorksByProjectIdAsync(int projectId)
        {
            var works = await _workRepository.GetWorksByProjectIdAsync(projectId);

            return works.Select(mapWorkToWorkSearchDTO);
        }

        public async Task<IEnumerable<WorkSearchDTO>> GetWorksByTypeAndUserIdAsync(WorkType type, Guid userId)
        {
            var works = await _workRepository.GetWorksByTypeAndUserIdAsync(type, userId);

            return works.Select(mapWorkToWorkSearchDTO);
        }

        public async Task<IEnumerable<WorkSearchDTO>> GetWorksByTypeAndProjectIdAsync(WorkType type, int projectId)
        {
            var works = await _workRepository.GetWorksByTypeAndProjectIdAsync(type, projectId);

            return works.Select(mapWorkToWorkSearchDTO);
        }

        public async Task<Work> CreateWorkAsync(CreateWorkDTO workDTO)
        {
            var work = mapCreateWorkDTOToWork(workDTO);

            return await _workRepository.CreateWorkAsync(work);
        }

        public async Task<Work> UpdateWorkAsync(UpdateWorkDTO workDTO)
        {
            var work = await _workRepository.GetWorkAsync(workDTO.Id);

            work = setUpdateWorkDTOToWork(work, workDTO);

            return await _workRepository.UpdateWorkAsync(work);
        }

        public async Task DeleteWorkAsync(int workId)
        {
            await _workRepository.DeleteWorkAsync(workId);
        }

        private WorkSearchDTO mapWorkToWorkSearchDTO(Work work)
        {
            return new WorkSearchDTO
            {
                Id = work.Id,
                Title = work.Title,
                Description = work.Description,
                WorkType = work.WorkType,
                CreatedAt = work.CreatedAt,
                UpdatedAt = work.UpdatedAt,
                ResearchScore = work.ResearchScore,
                HIndex = work.HIndex,
                CitationsCount = work.CitationsCount,
                Link = work.Link,
                Public = work.Public,
                CurrentWorkVersionId = work.CurrentWorkVersionId,
            };
        }

        private Work mapCreateWorkDTOToWork(CreateWorkDTO workDTO)
        {
            return new Work
            {
                Title = workDTO.Title,
                Description = workDTO.Description,
                WorkType = Enum.Parse<WorkType>(workDTO.WorkType),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        private Work setUpdateWorkDTOToWork(Work work, UpdateWorkDTO workDTO)
        {
            work.Title = workDTO.Title;
            work.Description = workDTO.Description;
            work.WorkType = Enum.Parse<WorkType>(workDTO.WorkType);
            work.UpdatedAt = DateTime.UtcNow;

            return work;
        }
    }

}