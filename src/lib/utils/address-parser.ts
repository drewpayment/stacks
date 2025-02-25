import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
import type { InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';


/**
 * Parses MySQL user address data into the PostgreSQL format
 * Handles both structured and unstructured address data
 */
export function parseAddressData(userData: SelectLegacyEmployee): Partial<InsertEmployeeProfile> {
  // Check if we have well-structured data already
  if (userData.city && userData.state && userData.postalCode) {
    return {
      address: userData.address || '',
      address2: userData.address2 || '',
      city: userData.city,
      state: userData.state,
      zip: userData.postalCode
    };
  }

  // If we only have a single address field, we need to parse it
  if (userData.address && !userData.city && !userData.state) {
    return parseUnstructuredAddress(userData.address);
  }

  // Fallback for incomplete data
  return {
    address: userData.address || '',
    address2: userData.address2 || '',
    city: userData.city || '',
    state: userData.state || '',
    zip: userData.postalCode || ''
  };
}

/**
 * Parses an unstructured address string into structured components
 * Uses regex patterns to identify address parts
 */
function parseUnstructuredAddress(addressStr: string): Partial<InsertEmployeeProfile> {
  // Initialize with empty values
  const result: Partial<InsertEmployeeProfile> = {
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  };

  // Clean up input by standardizing whitespace and removing excess commas
  const cleanedAddress = addressStr
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/g, '');

  // Try to match common US address patterns
  // Pattern: "123 Main St, Apt 4, Anytown, CA 12345" or variations
  
  // First try to extract ZIP code
  const zipMatch = cleanedAddress.match(/\b(\d{5}(?:-\d{4})?)\s*$/);
  if (zipMatch) {
    result.zip = zipMatch[1];
    // Remove ZIP from the string for further processing
    const withoutZip = cleanedAddress.substring(0, zipMatch.index).trim().replace(/,\s*$/, '');
    
    // Try to extract state (assuming 2-letter state code)
    const stateMatch = withoutZip.match(/,\s*([A-Z]{2})\s*$/i);
    if (stateMatch) {
      result.state = stateMatch[1].toUpperCase();
      // Remove state from the string
      const withoutState = withoutZip.substring(0, stateMatch.index).trim().replace(/,\s*$/, '');
      
      // Try to extract city
      const cityMatch = withoutState.match(/,\s*([^,]+)$/);
      if (cityMatch) {
        result.city = cityMatch[1].trim();
        // Remove city from the string
        const addressParts = withoutState.substring(0, cityMatch.index).trim().split(',');
        
        if (addressParts.length > 0) {
          result.address = addressParts[0].trim();
          
          // If there's still more after removing address, city, state, and zip, it's likely address2
          if (addressParts.length > 1) {
            result.address2 = addressParts.slice(1).join(', ').trim();
          }
        }
      } else {
        // If we couldn't find a city, use the rest as the address
        const addressParts = withoutState.split(',');
        if (addressParts.length > 0) {
          result.address = addressParts[0].trim();
          if (addressParts.length > 1) {
            result.address2 = addressParts.slice(1).join(', ').trim();
          }
        }
      }
    } else {
      // If we couldn't find a state, try to extract city and use the rest as address
      const cityMatch = withoutZip.match(/,\s*([^,]+)$/);
      if (cityMatch) {
        result.city = cityMatch[1].trim();
        const addressPart = withoutZip.substring(0, cityMatch.index).trim();
        const addressParts = addressPart.split(',');
        if (addressParts.length > 0) {
          result.address = addressParts[0].trim();
          if (addressParts.length > 1) {
            result.address2 = addressParts.slice(1).join(', ').trim();
          }
        }
      } else {
        // Last resort, just use the whole string as the address
        result.address = withoutZip;
      }
    }
  } else {
    // No ZIP code found, try to extract what we can
    const parts = cleanedAddress.split(',');
    if (parts.length >= 3) {
      // Assume last part is state+zip combined
      const stateZipPart = parts.pop()?.trim() || '';
      
      // Try to extract state and zip
      const stateZipMatch = stateZipPart.match(/([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i);
      if (stateZipMatch) {
        result.state = stateZipMatch[1].toUpperCase();
        result.zip = stateZipMatch[2];
      } else {
        // Just use it as state
        result.state = stateZipPart;
      }
      
      // Assume the part before state+zip is city
      result.city = parts.pop()?.trim() || '';
      
      // First part is address
      result.address = parts.shift()?.trim() || '';
      
      // Anything left is address2
      if (parts.length > 0) {
        result.address2 = parts.join(', ').trim();
      }
    } else if (parts.length === 2) {
      // Simple case: address, city+state+zip
      result.address = parts[0].trim();
      
      // Try to extract city, state, zip from the second part
      const cityStateZip = parts[1].trim().split(' ');
      if (cityStateZip.length >= 3) {
        // Last element is likely zip
        result.zip = cityStateZip.pop() || '';
        
        // Second to last is likely state
        result.state = cityStateZip.pop() || '';
        
        // The rest is city
        result.city = cityStateZip.join(' ').trim();
      }
    } else {
      // Only one part, just use it as address
      result.address = cleanedAddress;
    }
  }
  
  return result;
}