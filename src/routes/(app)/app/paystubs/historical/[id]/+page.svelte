<script lang="ts">
	import SalesTable from '$lib/components/SalesTable.svelte';
	import type { SelectLegacyExpense, SelectLegacyInvoice, SelectLegacyOverride, SelectLegacyPaystub } from '$lib/drizzle/mysql/db.model';
  import { formatCurrency, formatDate } from '$lib/utils/utils';
  import { Breadcrumb, BreadcrumbItem, Hr } from 'flowbite-svelte';

  export let data: { 
    statement: {
      paystub: SelectLegacyPaystub;
      sales: SelectLegacyInvoice[];
      overrides: SelectLegacyOverride[];
      expenses: SelectLegacyExpense[];
      totals: {
        sales: number;
        overrides: number;
        expenses: number;
      };
      tableData: any;
    };
  };
  const totals = data.statement.totals;
  
  console.log(data)
  
  const paystub = data.statement.paystub;
  const [firstName, ...lastNameParts] = paystub?.agentName.split(' ');
  const lastName = lastNameParts.join(' ');
  const totalSales = totals && totals.sales;
  const totalOverrides = totals && totals.overrides;
  const totalExpenses = totals && totals.expenses;
</script>

<div class="container max-w-5xl">
  <div class="flex">
      <div>
          <h1 class="text-2xl font-bold">Earnings Statement</h1>
          <p class="text-gray-500">
              Payment Date: {formatDate(paystub.issueDate)}
          </p>
      </div>
  </div>

  <div class="pb-4">
      <Breadcrumb>
          <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
          <BreadcrumbItem href="/app/payroll/search">Payrolls</BreadcrumbItem>
          <BreadcrumbItem>Legacy Paystub</BreadcrumbItem>
      </Breadcrumb>
  </div>

  <div class="w-full p-2">
      <div class="flex py-3">
          <h5 class="mb-2 text-xl font-bold tracking-tight">
              {paystub.vendorName}
          </h5>
      </div>

      <div class="flex py-4 justify-between items-end">
          <div>
              <h5 class="mb-2 text-xl font-bold tracking-tight">
                  {firstName} {lastName}
              </h5>
              <div>
                  <div class="text-gray-500 italic">Address information not available</div>
              </div>
          </div>

          <div>
              <p class="mb-2 tracking-tight">
                  <span class="font-bold">Pay Date:</span> {formatDate(paystub.issueDate)}
              </p>
              <p class="mb-2 tracking-tight">
                  <span class="font-bold">Weekending:</span> {formatDate(paystub.weekendDate)}
              </p>
          </div>
      </div>

      <div class="p-4 border-slate-300 border rounded-lg">
          <div class="flex justify-around gap-6 mt-4">
              <div>
                  <h5 class="mb-2 text-lg font-bold tracking-tight">Gross Pay</h5>
                  <p>
                      {formatCurrency(parseFloat(paystub.amount))}
                  </p>
              </div>
              <div>
                  <h5 class="mb-2 text-lg font-bold tracking-tight">Total Deductions</h5>
                  <p>
                      {formatCurrency(0)}
                  </p>
              </div>
              <div>
                  <h5 class="mb-2 text-lg font-bold tracking-tight">Net Pay</h5>
                  <p>
                      {formatCurrency(parseFloat(paystub.amount))}
                  </p>
              </div>
          </div>

          <Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-10" />

          <div class="flex justify-around gap-6 mb-8">
              <div>
                  <h6 class="mb-2 text-md font-bold tracking-tight">Vendor</h6>
                  <p class="text-center">
                      {paystub.vendorName}
                  </p>
              </div>
              <div>
                  <h6 class="mb-2 text-md font-bold tracking-tight">Sales</h6>
                  <p class="text-center">
                      {totalSales}
                  </p>
              </div>
              <div>
                  <h6 class="mb-2 text-md font-bold tracking-tight">Overrides</h6>
                  <p class="text-center">
                      {formatCurrency(totalOverrides)}
                  </p>
              </div>
              <div>
                  <h6 class="mb-2 text-md font-bold tracking-tight">Expenses</h6>
                  <p class="text-center">
                      {formatCurrency(totalExpenses)}
                  </p>
              </div>
          </div>

          <SalesTable data={data.statement.tableData} viewOnly={true} />
      </div>
  </div>
</div>