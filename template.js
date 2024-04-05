;(function myCustomConsentIntegration (window) {
  window.tealiumCmpIntegration = window.tealiumCmpIntegration || {}

  window.tealiumCmpIntegration.cmpName = 'Ketch'
  window.tealiumCmpIntegration.cmpIntegrationVersion = 'v1.0.0'
  var disableVendorIdValidation = false;

  window.tealiumCmpIntegration.cmpFetchCurrentConsentDecision = cmpFetchCurrentConsentDecision
  window.tealiumCmpIntegration.cmpFetchCurrentLookupKey = cmpFetchCurrentLookupKey
  window.tealiumCmpIntegration.cmpCheckIfOptInModel = cmpCheckIfOptInModel
  window.tealiumCmpIntegration.cmpCheckForWellFormedDecision = cmpCheckForWellFormedDecision
  window.tealiumCmpIntegration.cmpCheckForExplicitConsentDecision = cmpCheckForExplicitConsentDecision
  window.tealiumCmpIntegration.cmpCheckForTiqConsent = cmpCheckForTiqConsent
  window.tealiumCmpIntegration.cmpConvertResponseToGroupList = cmpConvertResponseToGroupList

 function cmpCheckIfOptInModel () {
    return true;
  }

  function cmpFetchCurrentConsentDecision () {
    // default consent
    var getDefaultConsent = function () {
      return {
        analytics: true,
        advertising: true,
        email_mktg: true,
        essential_services: true
      }; 
    }
    
    var getCookie = function (name) {
      const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
      return cookieValue ? cookieValue.pop() : '';
    }

    var decodeCookieValue = function (encodedValue) {
      const urlDecoded = decodeURIComponent(encodedValue);
      const base64Decoded = atob(urlDecoded);
      return base64Decoded;
    }

    const consentCookieValue = getCookie('_ketch_consent_v1_');
    let consent = getDefaultConsent();
    if (consentCookieValue) {
      const decodedValue = decodeCookieValue(consentCookieValue);
      if (decodedValue) {
        const cookieConsent = JSON.parse(decodedValue);
        if (cookieConsent) {
          for (const purposeCode in cookieConsent) {
            const val = cookieConsent[purposeCode];
            if (val) {
              const status = val.status;
              consent[purposeCode] = status === 'granted' ? true : false;
            }
          }
        }
      }
    } 
        
    return {'consent': consent};
  }

  function cmpFetchCurrentLookupKey () {
    return (window.tealiumCmpIntegration && window.tealiumCmpIntegration.map && Object.keys(window.tealiumCmpIntegration.map)[0]) || '(Vendor ID check disabled)'
  }

  // Should return a boolean - true if the raw decision meets our expectations for the CMP
  function cmpCheckForWellFormedDecision (cmpRawOutput) {
    if (!cmpRawOutput) { 
      return false; 
    }
    if (cmpRawOutput && cmpRawOutput.consent) {
      return true;
    }
   
    return false;
  }

  function cmpCheckForExplicitConsentDecision (cmpRawOutput) {
   return true
  }

  // Should return an array of consented vendors/purposes - these should match the Purposes in Tealium iQ exactly
  function cmpConvertResponseToGroupList (cmpRawOutput) {
    var purposeArray = [];
    
    cmpRawOutput && cmpRawOutput.consent && Object.keys(cmpRawOutput.consent).forEach(function (key) {
      if (cmpRawOutput.consent[key] === true) {
        purposeArray.push(key);
      }
    });
    return purposeArray;
  }

  function cmpCheckForTiqConsent (cmpRawOutput, tiqGroupName) {
    // treat things we don't understand as an opt-out
    if (cmpCheckForWellFormedDecision(cmpRawOutput) !== true) return false

    tiqGroupName = tiqGroupName || 'tiq-group-name-missing'
    var allowedGroups = cmpConvertResponseToGroupList(cmpRawOutput)
    return allowedGroups.indexOf(tiqGroupName) !== -1
  }
})(window);
