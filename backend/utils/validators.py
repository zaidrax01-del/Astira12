def validate_wallet(address):
    return isinstance(address, str) and len(address) == 42 and address.startswith('0x')
