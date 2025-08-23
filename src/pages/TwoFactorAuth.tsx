import React, { useState } from 'react';
import { Shield, Smartphone, Key, QrCode, Copy, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * Two Factor Authentication page component
 * Handles 2FA setup and management
 */
const TwoFactorAuth: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Mock secret key for setup (in real app, this would come from backend)
  
  const secretKey = 'JBSWY3DPEHPK3PXP';

  // Generate backup codes
  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    setShowBackupCodes(true);
  };

  // Handle 2FA setup
  const handleSetup2FA = () => {
    setShowSetup(true);
    generateBackupCodes();
  };

  // Handle 2FA verification
  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setIs2FAEnabled(true);
      setShowSetup(false);
      setVerificationCode('');
    }
  };

  // Handle 2FA disable
  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    setShowSetup(false);
    setShowBackupCodes(false);
    setBackupCodes([]);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
        <p className="text-gray-600">Secure your account with an additional layer of protection</p>
      </div>

      {!showSetup ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2FA Status */}
          <Card title="2FA Status" subtitle="Current security settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className={`h-8 w-8 ${is2FAEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600">
                      {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {is2FAEnabled ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>

              {is2FAEnabled ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Your account is protected with 2FA
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDisable2FA}
                    className="w-full"
                  >
                    Disable 2FA
                  </Button>
                  {backupCodes.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowBackupCodes(true)}
                      className="w-full"
                    >
                      View Backup Codes
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠ Your account is not protected with 2FA
                    </p>
                  </div>
                  <Button
                    onClick={handleSetup2FA}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Security Benefits */}
          <Card title="Security Benefits" subtitle="Why use 2FA?">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Enhanced Security</h4>
                  <p className="text-sm text-gray-600">
                    Protects against unauthorized access even if password is compromised
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Mobile Convenience</h4>
                  <p className="text-sm text-gray-600">
                    Use any authenticator app on your smartphone
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Key className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Backup Codes</h4>
                  <p className="text-sm text-gray-600">
                    Secure backup codes for account recovery
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Recommended Apps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Google Authenticator</li>
                <li>• Microsoft Authenticator</li>
                <li>• Authy</li>
                <li>• 1Password</li>
              </ul>
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card title="Setup Two-Factor Authentication" subtitle="Follow these steps to secure your account">
            <div className="space-y-6">
              {/* Step 1: Download App */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Download Authenticator App
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Download and install an authenticator app on your mobile device.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Google Play
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smartphone className="h-4 w-4 mr-2" />
                      App Store
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 2: Scan QR Code */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Scan QR Code
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Open your authenticator app and scan this QR code:
                  </p>
                  
                  <div className="bg-white p-6 border-2 border-gray-200 rounded-lg text-center">
                    <QrCode className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">QR Code placeholder</p>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Can't scan? Enter this key manually:
                    </p>
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <code className="text-sm font-mono">{secretKey}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(secretKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Verify */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verify Setup
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter the 6-digit code from your authenticator app:
                  </p>
                  
                  <div className="flex space-x-3">
                    <Input
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="text-center text-lg font-mono tracking-widest"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleVerify2FA}
                      disabled={verificationCode.length !== 6}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowSetup(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerify2FA}
                  disabled={verificationCode.length !== 6}
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Backup Codes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Save these backup codes in a secure location. Each code can only be used once.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded text-center font-mono">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button
                onClick={() => setShowBackupCodes(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
