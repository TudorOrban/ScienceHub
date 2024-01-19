﻿using System.ComponentModel.DataAnnotations;

namespace sciencehub_backend.Features.Projects.Dto
{
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title must be less than 100 characters long.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name must be less than 100 characters long.")]
        public string Name { get; set; }

        public string Description { get; set; }

        //[Required(ErrorMessage = "At least one user is required.")]
        //public List<string> Users { get; set; }

        public bool Public { get; set; }
    }
}
