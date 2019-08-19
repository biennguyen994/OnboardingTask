using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingReact.Models;

namespace OnboardingReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly SalesDatabaseContext _context;
        List<SaleRec> st = new List<SaleRec>();
        public SalesController(SalesDatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Sales
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Sales>>> GetSales()
        //{
        //    return await _context.Sales.ToListAsync();
        //}
        [HttpGet("[action]")]
        public IEnumerable<SaleRec> GetSales()
        {
            var al = _context.Sales.ToList();
            var cl = _context.Customer.ToList();
            var sl = _context.Store.ToList();
            var pl = _context.Product.ToList();
            foreach (Sales a in al)
            {
                SaleRec s = new SaleRec();
                s.Id = a.Id;
                foreach (Customer c in cl)
                {
                    if (c.Id == a.CustomerId)
                    {
                        s.customerName = c.Name;
                    }
                };
                foreach (Product p in pl)
                {
                    if (p.Id == a.ProductId)
                    {
                        s.productName = p.Name;
                    }
                };
                foreach (Store se in sl)
                {
                    if (se.Id == a.StoreId)
                    {
                        s.storeName = se.Name;
                    }
                };


                DateTime dt = Convert.ToDateTime(a.DateSold);

                s.DateSold = dt.ToString("dd MMM, yyyy");

                st.Add(s);
            }
            return st;
        }

        // GET: api/Sales/5
        [HttpGet("GetSales/{id}")]
        public async Task<ActionResult<Sales>> GetSales(int id)
        {
            var sales = await _context.Sales.FindAsync(id);

            if (sales == null)
            {
                return NotFound();
            }

            return sales;
        }

        // PUT: api/Sales/5
        [HttpPut("[action]")]
        public async Task<IActionResult> EditSales([FromBody]Sales sales)
        {
            //if (id != sales.Id)
            //{
            //    return BadRequest();
            //}

            _context.Entry(sales).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesExists(sales.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Sales
        [HttpPost("PostSales")]
        public async Task<ActionResult<Sales>> PostSales([FromBody]Sales sales)
        {
            _context.Sales.Add(sales);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSales", new { id = sales.Id }, sales);
        }

        // DELETE: api/Sales/5
        [HttpDelete("DeleteSales/{id}")]
        public async Task<ActionResult<Sales>> DeleteSales(int id)
        {
            var sales = await _context.Sales.FindAsync(id);
            if (sales == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sales);
            await _context.SaveChangesAsync();

            return sales;
        }

        private bool SalesExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }
    }
}
