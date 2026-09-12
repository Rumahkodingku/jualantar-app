import { ServicePage } from "../components/service-page"
import { getServiceBySlug } from "../service-catalog"

const service = getServiceBySlug("jaride")

export default function JaRideRoute() {
    return <ServicePage service={service} />
}
