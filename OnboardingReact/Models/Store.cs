using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace OnboardingReact.Models
{
    public partial class Store
    {
        public Store()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }
        [DisplayName("Store Name")]
        [Required(ErrorMessage = "Store Name is required")]
        public string Name { get; set; }
        [DisplayName("Store Address")]
        [Required(ErrorMessage = "Store Address is required")]
        public string Address { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
