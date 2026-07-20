import React from "react";
import { Field, ErrorMessage } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, DollarSign, Tag, Receipt, CreditCard, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFareRuleById, getFareRulesByAirline } from "@/Redux/fareRules/fareRulesThunk";

const FareFormSection = ({
  cabinClass,
  fareIndex,
  values,
  setFieldValue,
  onRemoveFare
}) => {
  const { fareRules } = useSelector(state => state.fareRules);
  const dispatch=useDispatch()

  console.log("fare rules ", fareRules)

  const fareFieldName = `fares.${fareIndex}`;

  const getCabinClassColor = (cabinType) => {
    const colors = {
      'ECONOMY': 'bg-green-100 text-green-800 border-green-200',
      'PREMIUM_ECONOMY': 'bg-blue-100 text-blue-800 border-blue-200',
      'BUSINESS': 'bg-purple-100 text-purple-800 border-purple-200',
      'FIRST_CLASS': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'FIRST': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[cabinType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(()=>{
    dispatch(getFareRulesByAirline(1))
  },[])

  return (
    <Card className="relative border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {cabinClass?.name?.replace(/_/g, ' ') || 'Cabin'} Fare
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getCabinClassColor(cabinClass?.name)}>
                  {cabinClass?.code}
                </Badge>
                {cabinClass?.description && (
                  <p className="text-sm text-muted-foreground">
                    {cabinClass.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          {onRemoveFare && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFare(fareIndex)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cabin Class (Hidden Field) */}
        <Field
          type="hidden"
          name={`${fareFieldName}.cabinClass`}
          value={cabinClass?.name || cabinClass?.id || ''}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Fare */}
          <div>
            <Label htmlFor={`${fareFieldName}.baseFare`} className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-600" />
              Base Fare *
            </Label>
            <Field name={`${fareFieldName}.baseFare`}>
              {({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id={`${fareFieldName}.baseFare`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                </div>
              )}
            </Field>
            <ErrorMessage name={`${fareFieldName}.baseFare`} component="div" className="text-sm text-red-600 mt-1" />
            {values.fares?.[fareIndex]?.baseFare && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(values.fares[fareIndex].baseFare)}
              </p>
            )}
          </div>

          {/* Taxes and Fees */}
          <div>
            <Label htmlFor={`${fareFieldName}.taxesAndFees`} className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-orange-600" />
              Taxes & Fees *
            </Label>
            <Field name={`${fareFieldName}.taxesAndFees`}>
              {({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id={`${fareFieldName}.taxesAndFees`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                </div>
              )}
            </Field>
            <ErrorMessage name={`${fareFieldName}.taxesAndFees`} component="div" className="text-sm text-red-600 mt-1" />
            {values.fares?.[fareIndex]?.taxesAndFees && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(values.fares[fareIndex].taxesAndFees)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Airline Fees */}
          <div>
            <Label htmlFor={`${fareFieldName}.airlineFees`} className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Airline Fees *
            </Label>
            <Field name={`${fareFieldName}.airlineFees`}>
              {({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id={`${fareFieldName}.airlineFees`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                </div>
              )}
            </Field>
            <ErrorMessage name={`${fareFieldName}.airlineFees`} component="div" className="text-sm text-red-600 mt-1" />
            {values.fares?.[fareIndex]?.airlineFees && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(values.fares[fareIndex].airlineFees)}
              </p>
            )}
          </div>

          {/* Fare Rules */}
          <div>
            <Label htmlFor={`${fareFieldName}.fareRulesId`} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Fare Rules *
            </Label>
            <Field name={`${fareFieldName}.fareRulesId`}>
              {({ field }) => (
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={(value) => setFieldValue(`${fareFieldName}.fareRulesId`, parseInt(value))}
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select fare rules" />
                  </SelectTrigger>
                  <SelectContent>
                    {fareRules.map((rule) => (
                      <SelectItem key={rule.id} value={rule.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{rule.ruleName}</span>
                          <span className="text-xs text-muted-foreground">{rule.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name={`${fareFieldName}.fareRulesId`} component="div" className="text-sm text-red-600 mt-1" />
          </div>
        </div>

        {/* Current Price - Calculated Field */}
        <div className="pt-4 border-t border-gray-200">
          <Label className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Total Current Price
          </Label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Field name={`${fareFieldName}.currentPrice`}>
              {({ field }) => {
                // Auto-calculate current price
                const baseFare = parseFloat(values.fares?.[fareIndex]?.baseFare || 0);
                const taxesAndFees = parseFloat(values.fares?.[fareIndex]?.taxesAndFees || 0);
                const airlineFees = parseFloat(values.fares?.[fareIndex]?.airlineFees || 0);
                const calculatedTotal = baseFare + taxesAndFees + airlineFees;

                // Update the field value if different
                if (field.value !== calculatedTotal) {
                  setTimeout(() => {
                    setFieldValue(`${fareFieldName}.currentPrice`, calculatedTotal);
                  }, 0);
                }

                return (
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Base Fare:</span>
                        <span>{formatCurrency(baseFare)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Taxes & Fees:</span>
                        <span>{formatCurrency(taxesAndFees)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Airline Fees:</span>
                        <span>{formatCurrency(airlineFees)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="text-lg font-bold text-primary flex justify-between">
                        <span>Total:</span>
                        <span>{formatCurrency(calculatedTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

