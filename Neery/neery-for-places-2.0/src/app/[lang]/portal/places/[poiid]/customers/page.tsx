"use client";

import { Customer, getCustomers } from "@/lib/api/customers";
import { useContext, useEffect, useState } from "react";
import LoaderScreen from "../calendar/components/LoaderScreen";
import IconButton from "@/components/ui/IconButton";
import { Envelope, Pen, Phone, Repeat } from "@/components/ui/icons";
import EditCustomerModal, { EditCustomerModalContext, customerToData } from "./components/EditCustomerModal";
import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";
import { Place, getPlace } from "@/lib/api/places";

function CustomerCard({
  customer,
  poiid,
}: {
  customer: Customer,
  poiid: string,
}) {
  const ctx = useContext(EditCustomerModalContext);

  return (
    <div className={`
      p-[8px] rounded-[16px]
      border border-neutral-200
      flex flex-col gap-[4px]
    `}>
      <div className="flex items-center justify-between mb-[8px]">
        <p className="font-medium">{customer.name}</p>

        <IconButton
          icon={Pen}
          iconClass="w-[0.7rem] h-[0.7rem]"
          action={() => ctx.update(customerToData(poiid, customer))}
        />
      </div>
      <div className="flex items-center gap-[8px] text-[14px]">
        <Phone className="w-[1rem] h-[1rem]" />
        <a href={`tel:${encodeURIComponent(customer.phone)}`}>{customer.phone}</a>
      </div>
      <div className="flex items-center gap-[8px] text-[14px]">
        <Envelope className="w-[1rem] h-[1rem]" />
        <a href={`mailto:${encodeURIComponent(customer.email)}`}>{customer.email}</a>
      </div>
      <div className="flex items-center gap-[8px] text-[14px]">
        <Repeat className="w-[1rem] h-[1rem]" />
        <span>{customer.visits}</span>
      </div>
      {customer.comment !== undefined ? (
        <p className="text-[14px]">{customer.comment}</p>
      ) : null}
    </div>
  );
}

export default function Customers({
  params: { poiid },
}: {
  params: { poiid: string },
}) {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const { t } = useTranslation("portal/customers");
  const [sortByVisit, setSort] = useState<boolean>(false);

  function sortCustomers(cust: Customer[]) {
    if (sortByVisit) {
      return [...cust].sort((a, b) => b.visits - a.visits || (a.name ?? "").localeCompare(b.name ?? ""));
    } else {
      return [...cust].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    }
  }

  useEffect(() => {
    getPlace(poiid)
      .then(place => setPlace(place));

    getCustomers(poiid)
      .then(customers => {
        setCustomers(sortCustomers(customers));
      });
  }, [poiid]);

  useEffect(() => {
    setCustomers(customers => customers ? sortCustomers(customers) : null);
  }, [sortByVisit]);

  if (customers === null || place === null) {
    return (
      <LoaderScreen />
    );
  }

  return (
    <EditCustomerModal onChange={() => getCustomers(poiid).then(setCustomers)} place={place}>
      <div className="flex flex-col w-full h-full p-[32px]">
        <h1 className="font-semibold text-[24px] mb-[32px]">{t("title")} ({customers.length})</h1>

        <Button
          palette="secondary"
          action={() => setSort(sort => !sort)}
          className="mb-[32px] w-full xl:w-[calc(60%-15px)]"
        >
          {sortByVisit ? "Váltás ABC sorrendre" : "Váltás visszatérés sorrendre"}
        </Button>

        <div className="flex flex-col gap-[8px] w-full xl:w-3/5 h-full pr-4 overflow-y-auto">
          {customers.map(customer => (
            <CustomerCard
              key={customer.uuid}
              customer={customer}
              poiid={poiid}
            />
          ))}
        </div>
      </div>
    </EditCustomerModal>
  );
}
