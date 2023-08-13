export function getName(guests: any, gender: string) {
	return guests.guests
		?.filter((guest: any) => guest.gender === gender)
		.map((guest: any) => guest.name)
		.join()
}
