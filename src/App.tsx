import { useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import jsPDF from 'jspdf';

const gstOptions = [5, 12, 18, 28];

type Item = {
  description: string;
  quantity: number;
  rate: number;
  gst: number;
};

type FormValues = {
  companyName: string;
  companyGst: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  customerName: string;
  customerGst: string;
  customerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  items: Item[];
};

const defaultValues: FormValues = {
  companyName: 'Smart Invoice Co.',
  companyGst: '27ABCDE1234F1Z5',
  companyAddress: '123 Business Street, Mumbai',
  companyEmail: 'hello@smartinvoice.com',
  companyPhone: '+91 98765 43210',
  customerName: 'Acme Enterprises',
  customerGst: '27QWERT1234A1Z9',
  customerAddress: '45 Client Road, Pune',
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().slice(0, 10),
  items: [
    { description: 'Laptop', quantity: 1, rate: 50000, gst: 18 },
  ],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { control, watch, handleSubmit, register } = useForm<FormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');
  const watchedInvoiceNumber = watch('invoiceNumber');
  const watchedInvoiceDate = watch('invoiceDate');
  const watchedCustomerName = watch('customerName');
  const watchedCustomerAddress = watch('customerAddress');
  const watchedCompanyName = watch('companyName');
  const watchedCompanyGst = watch('companyGst');
  const watchedCompanyAddress = watch('companyAddress');
  const watchedCompanyEmail = watch('companyEmail');
  const watchedCompanyPhone = watch('companyPhone');

  const totals = useMemo(() => {
    const subtotal = watchedItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const gstAmount = watchedItems.reduce((sum, item) => sum + (item.quantity * item.rate * item.gst) / 100, 0);
    const total = subtotal + gstAmount;
    return { subtotal, gstAmount, total };
  }, [watchedItems]);

  const onSubmit = (data: FormValues) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const left = 40;
    const top = 40;
    doc.setFontSize(22);
    doc.setTextColor('#4F46E5');
    doc.text('Smart Invoice & GST Generator', left, top);
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text(`Invoice No: ${data.invoiceNumber}`, left, top + 30);
    doc.text(`Date: ${data.invoiceDate}`, left, top + 45);
    doc.text(`Company: ${data.companyName}`, left, top + 70);
    doc.text(`GST: ${data.companyGst}`, left, top + 85);
    doc.text(`Email: ${data.companyEmail}`, left, top + 100);
    doc.text(`Phone: ${data.companyPhone}`, left, top + 115);
    doc.text(`Bill To: ${data.customerName}`, left, top + 145);
    doc.text(`Customer GST: ${data.customerGst}`, left, top + 160);
    doc.text(`Customer Address: ${data.customerAddress}`, left, top + 175);

    const tableTop = top + 215;
    doc.setFontSize(11);
    doc.text('Item', left, tableTop);
    doc.text('Qty', left + 220, tableTop);
    doc.text('Rate', left + 280, tableTop);
    doc.text('GST', left + 360, tableTop);
    doc.text('Amount', left + 420, tableTop);

    let rowTop = tableTop + 15;
    data.items.forEach((item) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description || 'Item', left, rowTop);
      doc.text(String(item.quantity), left + 220, rowTop);
      doc.text(formatCurrency(item.rate), left + 280, rowTop);
      doc.text(`${item.gst}%`, left + 360, rowTop);
      doc.text(formatCurrency(amount), left + 420, rowTop);
      rowTop += 18;
    });

    rowTop += 20;
    doc.text(`Subtotal: ${formatCurrency(totals.subtotal)}`, left, rowTop);
    doc.text(`GST: ${formatCurrency(totals.gstAmount)}`, left, rowTop + 15);
    doc.text(`Total: ${formatCurrency(totals.total)}`, left, rowTop + 30);

    doc.save('invoice.pdf');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-surface dark:bg-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Smart Invoice</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Smart Invoice & GST Generator
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Create professional invoices, calculate GST automatically, and export PDF invoices instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-indigo-600"
            >
              {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </header>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: 'GST Calculator', description: 'Calculate subtotal, GST, and total amount instantly.' },
              { title: 'Invoice Generator', description: 'Create professional invoices with customer and business details.' },
              { title: 'PDF Download', description: 'Generate a ready-to-download invoice PDF with one click.' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70 dark:shadow-slate-950/40">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </section>

          <div className="mt-12 grid gap-10 xl:grid-cols-[1.2fr,0.8fr]">
            <main className="space-y-8 rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/80 dark:shadow-slate-950/40">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Invoice</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Fill in business, customer, and product details to see a live invoice preview and download PDF.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/80">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Business Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      Company Name
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('companyName')} />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      GST Number
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('companyGst')} />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      Address
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('companyAddress')} />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      Email
                      <input type="email" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('companyEmail')} />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    Phone
                    <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('companyPhone')} />
                  </label>
                </section>

                <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/80">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Customer Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      Customer Name
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('customerName')} />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      Customer GST
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('customerGst')} />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    Address
                    <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('customerAddress')} />
                  </label>
                </section>

                <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Product Details</h3>
                    <button type="button" onClick={() => append({ description: '', quantity: 1, rate: 0, gst: 18 })} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500">
                      + Add Item
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-700/80 dark:bg-slate-950">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            Description
                            <input className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" {...register(`items.${index}.description` as const)} />
                          </label>
                          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            Quantity
                            <input type="number" min="1" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                          </label>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            Rate
                            <input type="number" min="0" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" {...register(`items.${index}.rate`, { valueAsNumber: true })} />
                          </label>
                          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            GST %
                            <Controller
                              control={control}
                              name={`items.${index}.gst` as const}
                              render={({ field }) => (
                                <select className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" {...field}>
                                  {gstOptions.map((rate) => (
                                    <option key={rate} value={rate}>
                                      {rate}%
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </label>
                          <button type="button" onClick={() => remove(index)} className="mt-6 self-end rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 text-sm dark:border-slate-700/80 dark:bg-slate-900/80">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-slate-700 dark:text-slate-200">
                      Invoice Number
                      <input className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('invoiceNumber')} />
                    </label>
                    <label className="space-y-2 text-slate-700 dark:text-slate-200">
                      Invoice Date
                      <input type="date" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...register('invoiceDate')} />
                    </label>
                  </div>
                  <button type="submit" className="inline-flex justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-indigo-600">
                    Generate PDF Invoice
                  </button>
                </section>
              </form>
            </main>

            <aside className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-slate-950/40">
              <div className="space-y-4">
                <div className="rounded-3xl bg-primary/10 p-5 text-sm text-primary dark:bg-primary/20 dark:text-white">
                  <p className="font-semibold">Live Invoice Preview</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-200">
                    Your invoice updates automatically as you type product details and customer information.
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Invoice</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{watchedInvoiceNumber}</h2>
                    </div>
                    <span className="rounded-2xl bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary dark:bg-cyan-500/15 dark:text-cyan-200">{watchedInvoiceDate}</span>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">From</p>
                      <p>{watchedCompanyName}</p>
                      <p>{watchedCompanyAddress}</p>
                      <p>{watchedCompanyEmail}</p>
                      <p>{watchedCompanyPhone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Bill To</p>
                      <p>{watchedCustomerName}</p>
                      <p>{watchedCustomerAddress}</p>
                    </div>
                  </div>

                  <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-200">
                      <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">Rate</th>
                          <th className="px-4 py-3">GST</th>
                          <th className="px-4 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchedItems.map((item, index) => (
                          <tr key={`${item.description}-${index}`} className={index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-900'}>
                            <td className="px-4 py-3">{item.description || 'Item'}</td>
                            <td className="px-4 py-3">{item.quantity}</td>
                            <td className="px-4 py-3">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-3">{item.gst}%</td>
                            <td className="px-4 py-3">{formatCurrency(item.quantity * item.rate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">GST</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(totals.gstAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
