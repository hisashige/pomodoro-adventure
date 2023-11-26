import { Injectable, NotFoundException } from "@nestjs/common";
import { LogInput } from "./dto/log.input";
import { Log } from "./models/log.model";
import { getLogCollection } from "src/utils/firestore";
import { now } from "src/utils/dateUtils";

@Injectable()
export class LogsService {
  async findListByUid(uid: string): Promise<Log[]> {
    const logCollection = getLogCollection();
    const logs = await logCollection.where("uid", "==", uid).get();

    if (logs.docs.length > 0) {
      return logs.docs.map((doc) => doc.data()) as Log[];
    }

    return [] as Log[];
  }

  async createLog(uid: string, logInput: LogInput): Promise<Log> {
    const logCollection = getLogCollection();
    const docRef = logCollection.doc(`${uid}_${logInput.id}`);
    const log = {
      ...logInput,
      uid,
      createdAt: now(),
      updatedAt: null,
    };
    await docRef.set(log);
    return log;
  }

  async updateLog(uid: string, logInput: LogInput): Promise<Log> {
    const logCollection = getLogCollection();

    const exitData = await logCollection
      .where("uid", "==", uid)
      .where("id", "==", logInput.id)
      .get();

    if (exitData.docs.length === 0) {
      throw new NotFoundException(
        `Log with ID[${logInput.id}] UID[${uid}] not found`
      );
    }

    const docRef = logCollection.doc(`${uid}_${logInput.id}`);
    const log = {
      ...logInput,
      updatedAt: now(),
    };
    await docRef.update(log);

    const rtnLog = {
      ...log,
      uid,
      createdAt: exitData.docs[0].data().createdAt as string,
    };
    return rtnLog;
  }
}
