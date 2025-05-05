import React, { useState } from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentMethodsProps {
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  totalAmount: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  onSelectPaymentMethod,
  totalAmount
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onSelectPaymentMethod(method);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <p className="text-gray-600 mb-6">
        Total: <span className="text-xl font-bold text-purple-700">{formatAmount(totalAmount)}</span>
      </p>

      <div className="space-y-4">
        {/* Mobile Payment Section */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Smartphone size={20} className="mr-2 text-purple-700" />
            Mobile Payment
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <PaymentOption
              id="mpesa"
              label="M-Pesa"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Vodacom_M-Pesa_Logo.svg/320px-Vodacom_M-Pesa_Logo.svg.png"
              isSelected={selectedMethod === 'mpesa'}
              onSelect={() => handleMethodSelect('mpesa')}
            />
            <PaymentOption
              id="tigopesa"
              label="Tigo Pesa"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Tigo_Logo.svg/320px-Tigo_Logo.svg.png"
              isSelected={selectedMethod === 'tigopesa'}
              onSelect={() => handleMethodSelect('tigopesa')}
            />
            <PaymentOption
              id="airtelmoney"
              label="Airtel Money"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Airtel_logo.svg/320px-Airtel_logo.svg.png"
              isSelected={selectedMethod === 'airtelmoney'}
              onSelect={() => handleMethodSelect('airtelmoney')}
            />
          </div>
        </div>

        {/* Card Payment Section */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <CreditCard size={20} className="mr-2 text-purple-700" />
            Card Payment
          </h3>
          <div>
            <PaymentOption
              id="creditcard"
              label="Credit / Debit Card"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
              secondLogoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
              isSelected={selectedMethod === 'creditcard'}
              onSelect={() => handleMethodSelect('creditcard')}
            />
          </div>
        </div>

        {/* Bank Transfer Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Building size={20} className="mr-2 text-purple-700" />
            Bank Transfer
          </h3>
          <div>
            <PaymentOption
              id="banktransfer"
              label="Bank Transfer"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/CRDB_Bank.svg/320px-CRDB_Bank.svg.png"
              isSelected={selectedMethod === 'banktransfer'}
              onSelect={() => handleMethodSelect('banktransfer')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaymentOptionProps {
  id: string;
  label: string;
  logoUrl: string;
  secondLogoUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  id,
  label,
  logoUrl,
  secondLogoUrl,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <input
          type="radio"
          id={id}
          name="paymentMethod"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
          checked={isSelected}
          onChange={onSelect}
        />
        <label htmlFor={id} className="ml-3 flex items-center justify-between w-full cursor-pointer">
          <span className="font-medium text-gray-900">{label}</span>
          <div className="flex space-x-2 items-center">
            <img src={logoUrl} alt={label} className="h-8 object-contain" />
            {secondLogoUrl && (
              <img src={secondLogoUrl} alt="" className="h-8 object-contain" />
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethods;