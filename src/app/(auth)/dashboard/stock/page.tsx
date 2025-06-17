'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface StockItem {
  id: string;
  grainType: string;
  quantity: number;
}

interface Transaction {
  type: 'add' | 'remove';
  quantity: number;
  location: string;
  date: Date;
}

interface NewStockData {
  grainType: string;
  initialQuantity: number;
}

export default function StockPage() {
  const [grainStock, setGrainStock] = useState<StockItem[]>([
    { id: '1', grainType: 'Wheat', quantity: 1000 },
    { id: '2', grainType: 'Corn', quantity: 1500 },
    { id: '3', grainType: 'Soybeans', quantity: 800 },
  ]);

  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isNewStockModalOpen, setIsNewStockModalOpen] = useState(false);

  const [transactionQuantity, setTransactionQuantity] = useState('');
  const [transactionLocation, setTransactionLocation] = useState('');
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined);

  const [newStockData, setNewStockData] = useState<NewStockData>({ grainType: '', initialQuantity: 0 });

  const handleAddStockClick = (stock: StockItem) => {
    setSelectedStock(stock);
    setIsAddModalOpen(true);
  };

  const handleRemoveStockClick = (stock: StockItem) => {
    setSelectedStock(stock);
    setIsRemoveModalOpen(true);
  };

  const handleAddNewStockClick = () => {
    setIsNewStockModalOpen(true);
  };

  const handleAddTransaction = () => {
    if (!selectedStock || !transactionQuantity || !transactionLocation || !transactionDate) return;

    const quantity = parseInt(transactionQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      // Handle error: invalid quantity
      return;
    }

    setGrainStock(grainStock.map(stock =>
      stock.id === selectedStock.id ? { ...stock, quantity: stock.quantity + quantity } : stock
    ));

    // Here you would typically save the transaction to a backend
    const newTransaction: Transaction = {
      type: 'add',
      quantity: quantity,
      location: transactionLocation,
      date: transactionDate,
    };
    console.log('New Add Transaction:', newTransaction);

    setIsAddModalOpen(false);
    resetTransactionForm();
  };

  const handleRemoveTransaction = () => {
    if (!selectedStock || !transactionQuantity || !transactionLocation || !transactionDate) return;

    const quantity = parseInt(transactionQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      // Handle error: invalid quantity
      return;
    }

    if (selectedStock.quantity < quantity) {
      // Handle error: not enough stock
      return;
    }

    setGrainStock(grainStock.map(stock =>
      stock.id === selectedStock.id ? { ...stock, quantity: stock.quantity - quantity } : stock
    ));

    // Here you would typically save the transaction to a backend
    const newTransaction: Transaction = {
      type: 'remove',
      quantity: quantity,
      location: transactionLocation,
      date: transactionDate,
    };
    console.log('New Remove Transaction:', newTransaction);


    setIsRemoveModalOpen(false);
    resetTransactionForm();
  };

  const handleCreateNewStock = () => {
    if (!newStockData.grainType || newStockData.initialQuantity < 0) return;

    const newStockItem: StockItem = {
      id: Date.now().toString(), // Simple unique ID for demo
      grainType: newStockData.grainType,
      quantity: newStockData.initialQuantity,
    };

    setGrainStock([...grainStock, newStockItem]);

    setIsNewStockModalOpen(false);
    setNewStockData({ grainType: '', initialQuantity: 0 });
  };

  const resetTransactionForm = () => {
    setTransactionQuantity('');
    setTransactionLocation('');
    setTransactionDate(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Stock Management</h1>

      <div className="mb-6">
        <Button onClick={handleAddNewStockClick}>Add New Stock Type</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grainStock.map((stock) => (
          <Card key={stock.id}>
            <CardHeader>
              <CardTitle>{stock.grainType}</CardTitle>
              <CardDescription>Current Quantity: {stock.quantity}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleAddStockClick(stock)}>Add Stock</Button>
              <Button variant="outline" onClick={() => handleRemoveStockClick(stock)}>Remove Stock</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Stock Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
 <DialogTitle className="sr-only">Add Stock Modal</DialogTitle>
          <DialogHeader>
            <DialogTitle>Add Stock to {selectedStock?.grainType}</DialogTitle>
            <DialogDescription>
              Enter the details for the stock addition.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="add-quantity"
                type="number"
                value={transactionQuantity}
                onChange={(e) => setTransactionQuantity(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-location" className="text-right">
                Origin
              </Label>
              <Input
                id="add-location"
                value={transactionLocation}
                onChange={(e) => setTransactionLocation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionDate ? format(transactionDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={setTransactionDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTransaction}>Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Stock Modal */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent>
 <DialogTitle className="sr-only">Remove Stock Modal</DialogTitle>
          <DialogHeader>
            <DialogTitle>Remove Stock from {selectedStock?.grainType}</DialogTitle>
            <DialogDescription>
              Enter the details for the stock removal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="remove-quantity"
                type="number"
                value={transactionQuantity}
                onChange={(e) => setTransactionQuantity(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-location" className="text-right">
                Destination
              </Label>
              <Input
                id="remove-location"
                value={transactionLocation}
                onChange={(e) => setTransactionLocation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionDate ? format(transactionDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={setTransactionDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRemoveTransaction}>Remove Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Stock Type Modal */}
      <Dialog open={isNewStockModalOpen} onOpenChange={setIsNewStockModalOpen}>
        <DialogContent>
 <DialogTitle className="sr-only">New Stock Type Modal</DialogTitle>
          <DialogHeader>
            <DialogTitle>Create New Stock Type</DialogTitle>
            <DialogDescription>
              Enter the details for the new grain stock type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock-grain-type" className="text-right">
                Grain Type
              </Label>
              <Input
                id="new-stock-grain-type"
                value={newStockData.grainType}
                onChange={(e) => setNewStockData({ ...newStockData, grainType: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock-initial-quantity" className="text-right">
                Initial Quantity
              </Label>
              <Input
                id="new-stock-initial-quantity"
                type="number"
                value={newStockData.initialQuantity}
                onChange={(e) => setNewStockData({ ...newStockData, initialQuantity: parseInt(e.target.value, 10) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewStockModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNewStock}>Create Stock Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}