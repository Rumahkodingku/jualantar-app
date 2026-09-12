import { ServicePage } from "../components/service-page"
import { getServiceBySlug } from "../service-catalog"

const service = getServiceBySlug("jatitip")

export default function JaTitipRoute() {
    return <ServicePage service={service} />
}
