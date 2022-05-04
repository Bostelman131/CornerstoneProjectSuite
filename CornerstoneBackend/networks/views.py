from django.http import JsonResponse
import os

def NetworkStatus(request):
    if request.method == 'GET':
        ip_tests = {
            'Internet' : '8.8.8.8',
            'Local Server' : '172.18.50.2',
            'Montgomery Server' : '172.18.50.3',
            'Tanner Server' : '172.18.5.35'
        }

        for key, ip in ip_tests.items():
            response = os.popen(f"ping {ip} ").read()

            if( "Lost = 0" or "Lost = 1" ) in response and ("Destination host unreachable.") not in response:
                ip_tests[key] = "Passed"
            else:
                ip_tests[key] = "Failed"

    return JsonResponse(ip_tests)

