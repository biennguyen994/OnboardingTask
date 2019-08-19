using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnboardingReact.Models
{
    public class SaleRec
    {
        public int Id { get; set; }
        public string productName { get; set; }
        public string customerName { get; set; }
        public string storeName { get; set; }
        public string DateSold { get; set; }
    }
}
