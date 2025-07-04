
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PackagePlus, ArrowUpCircle, ArrowDownCircle, Package, ShoppingBag, Truck, Weight, Trash2, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { getLang } from '@/lib/locale-helper';
import { useToast } from '@/hooks/use-toast';
import type { StockItem } from '@/lib/types';


const WEIGHT_UNITS = ["kg", "tonnes", "lbs", "bushels"];

interface NewStockData {
  grainType: string;
  initialQuantity: number;
  unit: string;
}

export default function StockPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const dateFnsLocale = getLang(i18n.language);

  const [grainStock, setGrainStock] = useState<StockItem[]>([
    { id: '1', grainType: 'Wheat', quantity: 1000, unit: 'kg' },
    { id: '2', grainType: 'Corn', quantity: 1500, unit: 'bushels' },
    { id: '3', grainType: 'Soybeans', quantity: 800, unit: 'tonnes' },
  ]);

  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isNewStockModalOpen, setIsNewStockModalOpen] = useState(false);
  
  const [stockItemToDelete, setStockItemToDelete] = useState<StockItem | null>(null);
  const [isDeleteStockItemModalOpen, setIsDeleteStockItemModalOpen] = useState(false);


  const [transactionQuantity, setTransactionQuantity] = useState('');
  const [transactionUnit, setTransactionUnit] = useState(WEIGHT_UNITS[0]); 
  const [transactionLocation, setTransactionLocation] = useState('');
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    setTransactionDate(new Date());
  }, []);


  const [newStockData, setNewStockData] = useState<NewStockData>({ grainType: '', initialQuantity: 0, unit: WEIGHT_UNITS[0] });

  const handleAddStockClick = (stock: StockItem) => {
    setSelectedStock(stock);
    resetTransactionForm();
    setTransactionUnit(stock.unit); 
    setIsAddModalOpen(true);
  };

  const handleRemoveStockClick = (stock: StockItem) => {
    setSelectedStock(stock);
    resetTransactionForm();
    setTransactionUnit(stock.unit); 
    setIsRemoveModalOpen(true);
  };

  const handleAddNewStockClick = () => {
    setNewStockData({ grainType: '', initialQuantity: 0, unit: WEIGHT_UNITS[0] });
    setIsNewStockModalOpen(true);
  };

  const handleDeleteStockItemClick = (stock: StockItem) => {
    setStockItemToDelete(stock);
    setIsDeleteStockItemModalOpen(true);
  };

  const confirmDeleteStockItem = () => {
    if (!stockItemToDelete) return;
    setGrainStock(grainStock.filter(s => s.id !== stockItemToDelete.id));
    toast({
      title: t('stock_page.toast_stock_type_deleted.title'),
      description: t('stock_page.toast_stock_type_deleted.description', { grainType: t(`stock_page.grain_types.${stockItemToDelete.grainType.toLowerCase()}`, stockItemToDelete.grainType) }),
      variant: "destructive"
    });
    setIsDeleteStockItemModalOpen(false);
    setStockItemToDelete(null);
  };

  const handleAddTransaction = () => {
    if (!selectedStock || !transactionQuantity || !transactionLocation || !transactionDate || !transactionUnit) return;

    const quantity = parseInt(transactionQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: t('toast.error.title'), description: t('stock_page.invalid_quantity_alert'), variant: "destructive" });
      return;
    }

    setGrainStock(grainStock.map(stock =>
      stock.id === selectedStock.id ? { ...stock, quantity: stock.quantity + quantity } : stock
    ));
    
    toast({ 
      title: t('stock_page.toast_stock_added.title'), 
      description: t('stock_page.toast_stock_added.description', { 
        quantity, 
        grainType: t(`stock_page.grain_types.${selectedStock.grainType.toLowerCase()}`, selectedStock.grainType), 
        unit: t(`stock_page.units.${transactionUnit.toLowerCase()}`) 
      }) 
    });
    setIsAddModalOpen(false);
  };

  const handleRemoveTransaction = () => {
    if (!selectedStock || !transactionQuantity || !transactionLocation || !transactionDate || !transactionUnit) return;

    const quantity = parseInt(transactionQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: t('toast.error.title'), description: t('stock_page.invalid_quantity_alert'), variant: "destructive" });
      return;
    }

    if (selectedStock.quantity < quantity) {
      toast({ title: t('toast.error.title'), description: t('stock_page.not_enough_stock_alert'), variant: "destructive" });
      return;
    }

    setGrainStock(grainStock.map(stock =>
      stock.id === selectedStock.id ? { ...stock, quantity: stock.quantity - quantity } : stock
    ));
    
    toast({ 
      title: t('stock_page.toast_stock_removed.title'), 
      description: t('stock_page.toast_stock_removed.description', { 
        quantity, 
        grainType: t(`stock_page.grain_types.${selectedStock.grainType.toLowerCase()}`, selectedStock.grainType), 
        unit: t(`stock_page.units.${transactionUnit.toLowerCase()}`) 
      }) 
    });
    setIsRemoveModalOpen(false);
  };

  const handleCreateNewStock = () => {
    if (!newStockData.grainType || newStockData.initialQuantity < 0 || !newStockData.unit) {
      toast({ title: t('toast.error.title'), description: t('stock_page.invalid_new_stock_data_alert'), variant: "destructive" });
      return;
    }

    const newStockItem: StockItem = {
      id: Date.now().toString(), 
      grainType: newStockData.grainType,
      quantity: newStockData.initialQuantity,
      unit: newStockData.unit,
    };

    setGrainStock([...grainStock, newStockItem]);
    toast({ 
      title: t('stock_page.toast_stock_type_created.title'), 
      description: t('stock_page.toast_stock_type_created.description', { 
        grainType: newStockData.grainType // For new types, use the entered name directly
      }) 
    });
    setIsNewStockModalOpen(false);
  };

  const resetTransactionForm = () => {
    setTransactionQuantity('');
    setTransactionLocation('');
    setTransactionDate(new Date());
    setTransactionUnit(WEIGHT_UNITS[0]); 
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('stock_page.title')}</h1>
        <Button onClick={handleAddNewStockClick}>
          <PackagePlus className="mr-2 h-5 w-5" /> {t('stock_page.add_new_stock_type_button_new')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grainStock.map((stock) => (
          <Card key={stock.id} className="shadow-lg hover:shadow-xl transition-shadow relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                  {t(`stock_page.grain_types.${stock.grainType.toLowerCase()}`, stock.grainType)}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleDeleteStockItemClick(stock)}
                  aria-label={t('stock_page.delete_stock_item_aria_label', {grainType: stock.grainType})}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{t('stock_page.current_quantity_description', { quantity: stock.quantity, unit: t(`stock_page.units.${stock.unit.toLowerCase()}`) })}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => handleAddStockClick(stock)} className="w-full sm:w-auto">
                <ArrowUpCircle className="mr-2 h-5 w-5" /> {t('stock_page.add_stock_button_new')}
              </Button>
              <Button variant="outline" onClick={() => handleRemoveStockClick(stock)} className="w-full sm:w-auto">
                <ArrowDownCircle className="mr-2 h-5 w-5" /> {t('stock_page.remove_stock_button_new')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Stock Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" /> 
              {t('stock_page.add_stock_modal_title_new', { 
                grainType: selectedStock ? t(`stock_page.grain_types.${selectedStock.grainType.toLowerCase()}`, selectedStock.grainType) : '' 
              })}
            </DialogTitle>
            <DialogDescription>
               {t('stock_page.add_stock_modal_description_transaction')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-quantity" className="text-right col-span-1">
                {t('stock_page.quantity_label')}
              </Label>
              <Input
                id="add-quantity"
                type="number"
                value={transactionQuantity}
                onChange={(e) => setTransactionQuantity(e.target.value)}
                className="col-span-2"
                placeholder={t('stock_page.quantity_placeholder_add')}
              />
              <Select
                value={transactionUnit}
                onValueChange={setTransactionUnit}
              >
                <SelectTrigger className="col-span-1">
                  <SelectValue placeholder={t('stock_page.unit_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_UNITS.map((unitValue) => (
                    <SelectItem key={unitValue} value={unitValue}>
                      {t(`stock_page.units.${unitValue.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-location" className="text-right">
                {t('stock_page.origin_label')}
              </Label>
              <Input
                id="add-location"
                value={transactionLocation}
                onChange={(e) => setTransactionLocation(e.target.value)}
                className="col-span-3"
                placeholder={t('stock_page.origin_placeholder')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-date" className="text-right">
                {t('stock_page.date_label')}
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionDate ? format(transactionDate, "PPP", { locale: dateFnsLocale }) : <span>{t('stock_page.date_placeholder')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={setTransactionDate}
                      initialFocus
                      locale={dateFnsLocale}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>{t('field_form.cancel_button')}</Button>
            <Button onClick={handleAddTransaction}><ArrowUpCircle className="mr-2 h-5 w-5" />{t('stock_page.add_stock_button_new')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Stock Modal */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" /> 
              {t('stock_page.remove_stock_modal_title_new', { 
                grainType: selectedStock ? t(`stock_page.grain_types.${selectedStock.grainType.toLowerCase()}`, selectedStock.grainType) : '' 
              })}
            </DialogTitle>
            <DialogDescription>
              {t('stock_page.remove_stock_modal_description_transaction')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-quantity" className="text-right col-span-1">
                {t('stock_page.quantity_label')}
              </Label>
              <Input
                id="remove-quantity"
                type="number"
                value={transactionQuantity}
                onChange={(e) => setTransactionQuantity(e.target.value)}
                className="col-span-2"
                placeholder={t('stock_page.quantity_placeholder_remove')}
              />
              <Select
                value={transactionUnit}
                onValueChange={setTransactionUnit}
              >
                <SelectTrigger className="col-span-1">
                  <SelectValue placeholder={t('stock_page.unit_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_UNITS.map((unitValue) => (
                    <SelectItem key={unitValue} value={unitValue}>
                      {t(`stock_page.units.${unitValue.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-location" className="text-right">
                {t('stock_page.destination_label')}
              </Label>
              <Input
                id="remove-location"
                value={transactionLocation}
                onChange={(e) => setTransactionLocation(e.target.value)}
                className="col-span-3"
                placeholder={t('stock_page.destination_placeholder')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-date" className="text-right">
                {t('stock_page.date_label')}
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionDate ? format(transactionDate, "PPP", { locale: dateFnsLocale }) : <span>{t('stock_page.date_placeholder')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={setTransactionDate}
                      initialFocus
                      locale={dateFnsLocale}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveModalOpen(false)}>{t('field_form.cancel_button')}</Button>
            <Button onClick={handleRemoveTransaction}><ArrowDownCircle className="mr-2 h-5 w-5" />{t('stock_page.remove_stock_button_new')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Stock Type Modal */}
      <Dialog open={isNewStockModalOpen} onOpenChange={setIsNewStockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
               <PackagePlus className="mr-2 h-5 w-5 text-primary" /> {t('stock_page.new_stock_type_modal_title')}
            </DialogTitle>
            <DialogDescription>
              {t('stock_page.new_stock_type_modal_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock-grain-type" className="text-right">
                {t('stock_page.grain_type_label')}
              </Label>
              <Input
                id="new-stock-grain-type"
                value={newStockData.grainType}
                onChange={(e) => setNewStockData({ ...newStockData, grainType: e.target.value })}
                className="col-span-3"
                placeholder={t('stock_page.grain_type_placeholder')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock-initial-quantity" className="text-right">
                {t('stock_page.initial_quantity_label')}
              </Label>
              <Input
                id="new-stock-initial-quantity"
                type="number"
                value={newStockData.initialQuantity === 0 ? '' : String(newStockData.initialQuantity)}
                onChange={(e) => setNewStockData({ ...newStockData, initialQuantity: parseInt(e.target.value, 10) || 0 })}
                className="col-span-3"
                placeholder={t('stock_page.initial_quantity_placeholder')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock-unit" className="text-right flex items-center">
                <Weight className="mr-1 h-4 w-4 text-muted-foreground" />
                {t('stock_page.unit_label')}
              </Label>
              <Select
                value={newStockData.unit}
                onValueChange={(value) => setNewStockData({ ...newStockData, unit: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('stock_page.unit_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_UNITS.map((unitValue) => (
                    <SelectItem key={unitValue} value={unitValue}>
                      {t(`stock_page.units.${unitValue.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewStockModalOpen(false)}>{t('field_form.cancel_button')}</Button>
            <Button onClick={handleCreateNewStock}> <PackagePlus className="mr-2 h-4 w-4" /> {t('stock_page.create_stock_type_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Stock Item Confirmation Modal */}
      <AlertDialog open={isDeleteStockItemModalOpen} onOpenChange={setIsDeleteStockItemModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('stock_page.delete_stock_item_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('stock_page.delete_stock_item_dialog_description', { 
                grainType: stockItemToDelete ? t(`stock_page.grain_types.${stockItemToDelete.grainType.toLowerCase()}`, stockItemToDelete.grainType) : '' 
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStockItemToDelete(null)}>{t('field_form.cancel_button')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStockItem} className="bg-destructive hover:bg-destructive/90">
              {t('stock_page.delete_button_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    