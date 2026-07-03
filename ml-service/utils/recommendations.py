THREAT_MAP = {
    "DDoS": "Enable rate limiting, use Cloudflare/WAF, and scale bandwidth.",
    "SQL Injection": "Use prepared statements, sanitize all inputs, and update your ORM.",
    "Phishing": "Enable multi-factor authentication (MFA) and train users on email safety.",
    "Brute Force": "Implement account lockout policies and strengthen password requirements.",
    "Malware": "Run a full system scan, isolate infected machines, and update antivirus signatures."
}

def get_recommendation(threat_type):
    return THREAT_MAP.get(threat_type, "Monitor network logs and restrict unauthorized access.")